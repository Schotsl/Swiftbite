import { NextResponse } from "next/server";
import { cleanSearchResults } from "@/utils/openai";

// TODO: This is a temporary interface for the OpenFoodProductS
type OpenFoodNutriments = {
  fat_100g: number;
  salt_100g: number;
  fiber_100g: number;
  sugars_100g: number;
  sodium_100g: number;
  calcium_100g: number;
  proteins_100g: number;
  carbohydrates_100g: number;
  "trans-fat_100g": number;
  "energy-kcal_100g": number;
  "saturated-fat_100g": number;
};

type OpenFoodSearch = {
  code: string;
  brands: string;
  product_name: string;
  quantity: string;
  nutriments: OpenFoodNutriments;
  categories_tags: string[];
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const lang = searchParams.get("lang");
  const query = searchParams.get("query");

  // If no code or query
  if (!query) {
    return NextResponse.json({ error: "Query is required" }, { status: 400 });
  }

  // TODO: The categories_tags and nutriments are very expensive for the AI
  const fields = [
    "code",
    "brands",
    "product_name",
    "quantity",
    "nutriments",
    "categories_tags",
  ];

  const base = `https://search.openfoodfacts.org/search`;
  const joined = fields.join(",");
  const params = new URLSearchParams();

  if (lang) params.append("langs", lang);

  params.append("q", query);
  params.append("fields", joined);
  params.append("page_size", "500");

  const url = `${base}?${params.toString()}`;
  const response = await fetch(url);
  const data = await response.json();

  // Filter out any products that don't have a code, brands, product_name, quantity, nutriments but they can miss categories_tags
  // TODO: This really should be moved to the OpenAI function call
  const filtered = data.hits.filter((product: OpenFoodSearch) => {
    return (
      product.code &&
      product.brands &&
      product.product_name &&
      product.quantity &&
      product.nutriments
    );
  });

  if (!filtered.length) {
    return NextResponse.json({ error: "Products not found" }, { status: 404 });
  }

  const encoder = new TextEncoder();

  // Process the filtered results with AI to clean and deduplicate them
  const streamOpenAI = await cleanSearchResults(filtered);
  const streamResponse = new ReadableStream({
    async start(controller) {
      for await (const chunk of streamOpenAI) {
        const choice = chunk.choices[0];
        const call = choice.delta.tool_calls?.[0];

        const part = call?.function?.arguments;
        const partEncoded = encoder.encode(part);

        controller.enqueue(partEncoded);
      }

      controller.close();
    },
  });

  // Return a streaming response
  return new NextResponse(streamResponse, {
    headers: {
      "Content-Type": "application/json",
      "Transfer-Encoding": "chunked",
    },
  });
}
