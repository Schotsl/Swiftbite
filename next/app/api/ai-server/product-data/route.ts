import { supabase } from "@/utils/supabase";
import { handleError } from "@/helper";
import { generateEmbedding, searchProduct } from "@/utils/openai";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const uuid = request.nextUrl.searchParams.get("uuid");
  const lang = request.nextUrl.searchParams.get("lang");
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

  if (!brand) {
    return NextResponse.json(
      { error: "Please provide a brand" },
      { status: 400 }
    );
  }

  console.log(`[PRODUCT/${title}] Searching product`);

  const product = await searchProduct({
    lang,
    brand,
    title,
    quantity_original: quantity_original ? Number(quantity_original) : null,
    quantity_original_unit,
  });

  if (!product) {
    return NextResponse.json({ error: "No product found" }, { status: 404 });
  }

  const {
    quantity_gram: quantityGram,
    quantity_original: quantityOriginal,
    quantity_original_unit: quantityOriginalUnit,
    serving_gram: servingGram,
    serving_original: servingOriginal,
    serving_original_unit: servingOriginalUnit,
    ...rest
  } = product;

  const quantity =
    quantityGram && quantityOriginalUnit && quantityOriginal
      ? {
          gram: quantityGram,
          option: quantityOriginalUnit,
          quantity: quantityOriginal,
        }
      : null;

  const serving =
    servingGram && servingOriginalUnit && servingOriginal
      ? {
          gram: servingGram,
          option: servingOriginalUnit,
          quantity: servingOriginal,
        }
      : null;

  console.log(`[PRODUCT/${title}] Updating product`);

  const { error: errorProduct } = await supabase
    .from("product")
    .update({
      ...rest,
      quantity,
      serving,
    })
    .eq("uuid", uuid);

  handleError(errorProduct);

  let embeddingInput = `${title} ${brand}`;

  if (quantity) {
    embeddingInput += ` ${quantity.quantity} ${quantity.option}`;
  }

  console.log(`[PRODUCT/${title}] Generating embedding`);

  const embedding = await generateEmbedding({ value: embeddingInput });

  console.log(`[PRODUCT/${title}] Updating embedding`);

  const { error: errorEmbedding } = await supabase
    .from("product")
    .update({ embedding })
    .eq("uuid", uuid);

  handleError(errorEmbedding);

  const response = NextResponse.json({}, { status: 200 });
  return response;
}
