import OpenFoodFacts from "@openfoodfacts/openfoodfacts-nodejs";

import { mapProduct } from "@/utils/openfood";
import { NextRequest, NextResponse } from "next/server";

const client = new OpenFoodFacts(fetch);

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const lang = request.nextUrl.searchParams.get("lang");

  if (!code) {
    return NextResponse.json(
      { error: "Please provide a code" },
      { status: 400 },
    );
  }

  if (!lang) {
    return NextResponse.json(
      { error: "Please provide a language" },
      { status: 400 },
    );
  }

  const product = await client.getProduct(code);

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  const productMapped = mapProduct(product, lang);
  return NextResponse.json(productMapped);
}
