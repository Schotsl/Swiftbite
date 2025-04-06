import { getUser } from "@/utils/supabase";
import { NextResponse } from "next/server";
import { cleanProducts } from "@/utils/openai";
import { OpenFoodSearch } from "@/types";
import { streamToResponse } from "@/helper";

export async function POST(request: Request) {
  const body = await request.json();
  const user = await getUser(request);

  const signal = request.signal;

  const { query, lang } = body;

  if (!query || !lang) {
    return NextResponse.json(
      { error: "Please provide a query and a language" },
      { status: 400 },
    );
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

  const requestBase = `https://search.openfoodfacts.org/search`;
  const requestJoined = fields.join(",");
  const requestParams = new URLSearchParams();

  requestParams.append("q", query);
  requestParams.append("langs", lang);
  requestParams.append("fields", requestJoined);
  requestParams.append("page_size", "250");

  const OpenFoodUrl = `${requestBase}?${requestParams.toString()}`;
  const openFoodResponse = await fetch(OpenFoodUrl);
  const openFoodData = await openFoodResponse.json();

  // Filter out any products that don't have a code, brands, product_name, quantity, nutriments but they can miss categories_tags
  // TODO: This really should be moved to the OpenFood Facts API call
  const openFoodFiltered = openFoodData.hits.filter(
    (product: OpenFoodSearch) => {
      return (
        product.code &&
        product.brands &&
        product.product_name &&
        product.quantity &&
        product.nutriments &&
        product.categories_tags?.length > 0
      );
    },
  );

  // Drop the categories and nutriments
  const openFoodMapped = openFoodFiltered.map((product: OpenFoodSearch) => {
    return {
      title: product.product_name,
      brand: product.brands,
      quantity: product.quantity,
      openfood_id: product.code,
    };
  });

  if (!openFoodFiltered.length) {
    return NextResponse.json({ error: "Products not found" }, { status: 404 });
  }

  // Process the filtered results with AI to clean and deduplicate them
  const result = cleanProducts(user!, query, lang, openFoodMapped, signal);
  const response = streamToResponse(result);

  return response;
}
