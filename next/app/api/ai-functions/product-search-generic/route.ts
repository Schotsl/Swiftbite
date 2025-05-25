import { handleError } from "@/helper";
import { searchGeneric } from "@/utils/generative/generic";
import { getUser, supabase } from "@/utils/supabase";
import { generateEmbedding } from "@/utils/generative/generate";
import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 120;

export async function GET(request: NextRequest) {
  const user = await getUser(request);
  const uuid = request.nextUrl.searchParams.get("uuid");

  const lang = request.nextUrl.searchParams.get("lang");
  const title = request.nextUrl.searchParams.get("title");
  const category = request.nextUrl.searchParams.get("category");

  if (!uuid) {
    return NextResponse.json(
      { error: "Please provide a uuid" },
      { status: 400 }
    );
  }

  if (!lang) {
    return NextResponse.json(
      { error: "Please provide a language" },
      { status: 400 }
    );
  }

  if (!title) {
    return NextResponse.json(
      { error: "Please provide a title" },
      { status: 400 }
    );
  }

  if (!category) {
    return NextResponse.json(
      { error: "Please provide a category" },
      { status: 400 }
    );
  }

  console.log(`[PRODUCT/${title}] Searching product`);

  const product = await searchGeneric(user, {
    title,
    category: category!,
  });

  console.log(`[PRODUCT/${title}] Updating product`);

  const { error: errorProduct } = await supabase
    .from("product")
    .update({
      ...product,
      processing: false,
    })
    .eq("uuid", uuid);

  handleError(errorProduct);

  console.log(`[PRODUCT/${title}] Generating embedding`);

  const embeddingInput = `${title}`;
  const embedding = await generateEmbedding(user, { value: embeddingInput });

  console.log(`[PRODUCT/${title}] Updating embedding`);

  const { error: errorEmbedding } = await supabase
    .from("product")
    .update({ embedding })
    .eq("uuid", uuid);

  handleError(errorEmbedding);

  const response = NextResponse.json({}, { status: 200 });
  return response;
}
