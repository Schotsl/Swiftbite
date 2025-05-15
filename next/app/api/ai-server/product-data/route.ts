import { Enums } from "@/database.types";
import { supabase } from "@/utils/supabase";
import { ProductData } from "@/schema";
import { handleError } from "@/helper";
import {
  generateEmbedding,
  searchGeneric,
  searchProduct,
} from "@/utils/openai";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const uuid = request.nextUrl.searchParams.get("uuid");
  const type = request.nextUrl.searchParams.get("type") as Enums<"type">;
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

  if (!type) {
    return NextResponse.json(
      { error: "Please provide a type" },
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

  let product: ProductData | null = null;

  if (type === "search_product") {
    product = await searchProduct({
      lang,
      brand,
      title,
      quantity_original: quantity_original ? Number(quantity_original) : null,
      quantity_original_unit,
    });
  } else {
    const generic = await searchGeneric({
      lang,
      title,
      category: brand,
    });

    const { category, ...rest } = generic;

    product = {
      brand: category,
      barcode: null,
      ...rest,
    };
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
      serving,
      quantity,
      processing: false,
    })
    .eq("uuid", uuid);

  handleError(errorProduct);

  let embeddingInput = `${title}`;

  // If the brand is not already in the title we'll add it
  const lowerBrand = brand.toLowerCase();
  const lowerTitle = title.toLowerCase();

  if (!lowerTitle.includes(lowerBrand) && type === "search_product") {
    embeddingInput += ` ${brand}`;
  }

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
