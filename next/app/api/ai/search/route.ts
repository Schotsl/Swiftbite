import { getUser } from "@/utils/supabase";
import { NextRequest, NextResponse } from "next/server";
import { searchProducts } from "@/utils/openai";
import { streamToResponse } from "@/helper";

export async function GET(request: NextRequest) {
  const user = await getUser(request);

  const lang = request.nextUrl.searchParams.get("lang");
  const query = request.nextUrl.searchParams.get("query");

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

  const stream = await searchProducts(user!, query, lang, request.signal);
  const response = streamToResponse(stream);

  return response;
}
