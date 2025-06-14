import { handleError } from "@/helper";
import { searchProduct } from "@/utils/generative/product";
import { getUser, supabase } from "@/utils/supabase";
import { generateEmbedding } from "@/utils/generative/generate";
import { NextRequest, NextResponse } from "next/server";

// I've given this function a very high timeout since it can do long research using google
export const maxDuration = 300;

export async function GET(request: NextRequest) {
  const user = await getUser(request);

  const uuid = request.nextUrl.searchParams.get("uuid");
  const lang = request.nextUrl.searchParams.get("lang");
  const title = request.nextUrl.searchParams.get("title");
  const brand = request.nextUrl.searchParams.get("brand");
  const barcode = request.nextUrl.searchParams.get("barcode");

  const quantity_original =
    request.nextUrl.searchParams.get("quantity_original");

  const quantity_original_unit = request.nextUrl.searchParams.get(
    "quantity_original_unit",
  );

  if (!uuid) {
    return NextResponse.json(
      { error: "Please provide a uuid" },
      { status: 400 },
    );
  }

  if (!lang) {
    return NextResponse.json(
      { error: "Please provide a language" },
      { status: 400 },
    );
  }

  if (!title) {
    return NextResponse.json(
      { error: "Please provide a title" },
      { status: 400 },
    );
  }

  if (!brand) {
    return NextResponse.json(
      { error: "Please provide a brand" },
      { status: 400 },
    );
  }

  console.log(`[PRODUCT/${title}] Searching product`);

  const product = await searchProduct(user, {
    brand: brand!,
    title,
    barcode: barcode || undefined,
    quantity_original: quantity_original
      ? Number(quantity_original)
      : undefined,
    quantity_original_unit: quantity_original_unit || undefined,
  });

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
      serving,
      quantity,
      processing: false,
    })
    .eq("uuid", uuid);

  handleError(errorProduct);

  console.log(`[PRODUCT/${title}] Generating embedding`);

  let embeddingInput = `${title}`;

  // If the brand is not already in the title we'll add it
  const lowerBrand = brand.toLowerCase();
  const lowerTitle = title.toLowerCase();

  if (!lowerTitle.includes(lowerBrand)) {
    embeddingInput += ` ${brand}`;
  }

  if (quantity) {
    embeddingInput += ` ${quantity.quantity} ${quantity.option}`;
  }

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
