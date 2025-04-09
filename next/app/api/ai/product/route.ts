import { getUser } from "@/utils/supabase";
import { NextRequest, NextResponse } from "next/server";
import { searchProduct } from "@/utils/openai";

export async function GET(request: NextRequest) {
  const user = await getUser(request);

  const lang = request.nextUrl.searchParams.get("lang");
  const query = request.nextUrl.searchParams.get("query");
  const brand = request.nextUrl.searchParams.get("brand");
  const quantity = request.nextUrl.searchParams.get("quantity");

  if (!lang) {
    return NextResponse.json(
      { error: "Please provide a language" },
      { status: 400 },
    );
  }

  if (!query) {
    return NextResponse.json(
      { error: "Please provide a query" },
      { status: 400 },
    );
  }

  if (!brand) {
    return NextResponse.json(
      { error: "Please provide a brand" },
      { status: 400 },
    );
  }

  if (!quantity) {
    return NextResponse.json(
      { error: "Please provide a quantity" },
      { status: 400 },
    );
  }

  const product = await searchProduct(user!, query, lang, brand, quantity);
  const response = NextResponse.json(product);

  return response;
}
