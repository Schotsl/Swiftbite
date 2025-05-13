import { supabase } from "@/utils/supabase";
import { handleError } from "@/helper";
import { generateEmbedding } from "@/utils/openai";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const uuid = request.nextUrl.searchParams.get("uuid");
  const title = request.nextUrl.searchParams.get("title");
  const brand = request.nextUrl.searchParams.get("brand");

  const quantity_original =
    request.nextUrl.searchParams.get("quantity_original");

  const quantity_original_unit = request.nextUrl.searchParams.get(
    "quantity_original_unit"
  );

  if (!uuid) {
    return NextResponse.json(
      { error: "Please provide a uuid" },
      { status: 400 }
    );
  }

  if (!title) {
    return NextResponse.json(
      { error: "Please provide a title" },
      { status: 400 }
    );
  }

  if (!brand) {
    return NextResponse.json(
      { error: "Please provide a brand" },
      { status: 400 }
    );
  }

  console.log(`[EMBEDDING/${title}] Updating product`);

  const embeddingInput = [title, brand];

  if (quantity_original) {
    embeddingInput.push(`${quantity_original} ${quantity_original_unit}`);
  }

  const embedding = await generateEmbedding({ value: embeddingInput });

  const { error: errorEmbedding } = await supabase
    .from("test")
    .update({ embedding })
    .eq("uuid", uuid);

  handleError(errorEmbedding);

  const response = NextResponse.json({}, { status: 200 });
  return response;
}
