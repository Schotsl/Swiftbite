import { NextResponse } from "next/server";
import { cleanSearchResults } from "@/utils/openai";
import { OpenFoodSearch } from "@/types";

// Revalidate once every 30 days
export const revalidate = 2592000;

export async function GET(
  request: Request,
  { params }: { params: Promise<{ lang: string; query: string }> }
) {
  const { lang, query } = await params;

  // TODO: The categories_tags and nutriments are very expensive for the AI
  const fields = [
    "code",
    "brands",
    "product_name",
    "quantity",
    "nutriments",
    "categories_tags",
  ];

  const requestBase = `https://search.openfoodfacts.org/search`;
  const requestJoined = fields.join(",");
  const requestParams = new URLSearchParams();

  requestParams.append("q", query);
  requestParams.append("langs", lang);
  requestParams.append("fields", requestJoined);
  requestParams.append("page_size", "250");

  const url = `${requestBase}?${requestParams.toString()}`;
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
  const signal = request.signal;

  // Process the filtered results with AI to clean and deduplicate them
  const streamOpenAI = await cleanSearchResults(filtered, query, lang, signal);
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
