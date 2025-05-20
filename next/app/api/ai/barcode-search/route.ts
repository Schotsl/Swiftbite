import getUUID from "uuid-by-string";

import * as crypto from "crypto";

import { Product } from "@/types";
import { handleError } from "@/helper";
import { fatsecretRequest } from "@/utils/internet";
import { searchBarcodeQuick } from "@/utils/generative/barcode";
import { processSearchProduct } from "@/utils/processing";
import { googleRequest, openfoodRequest } from "@/utils/internet";
import { after, NextRequest, NextResponse } from "next/server";
import { GenericSearchData, ProductSearchData } from "@/schema";
import { fetchProductByBarcode, getUser, supabase } from "@/utils/supabase";

export async function GET(request: NextRequest) {
  const user = await getUser(request);

  const lang = request.nextUrl.searchParams.get("lang");
  const barcode = request.nextUrl.searchParams.get("barcode");

  const seed = crypto.randomUUID();
  const signal = request.signal;

  if (!barcode) {
    return NextResponse.json(
      { error: "Please provide a barcode" },
      { status: 400 }
    );
  }

  if (!lang) {
    return NextResponse.json(
      { error: "Please provide a language" },
      { status: 400 }
    );
  }

  const productSupabase = await fetchProductByBarcode(barcode);

  if (productSupabase) {
    return NextResponse.json(productSupabase);
  }

  const promises = [
    googleRequest(barcode, signal),
    openfoodRequest(barcode, lang, signal),
    fatsecretRequest(barcode, signal),
  ];

  const [google, openfood, fatsecret] = await Promise.all(promises);

  // Fetch product from supabase and openfood in parallel
  const productSearch = await searchBarcodeQuick(user!, {
    barcode,
    lang,
    google,
    openfood,
    fatsecret,
  });

  if (!productSearch) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  const product = getProduct(productSearch, seed, barcode);

  const { error } = await supabase.from("product").insert(product);

  handleError(error);

  after(async () => {
    processSearchProduct(product.uuid, lang, productSearch, barcode);
  });

  return NextResponse.json(product);
}

// Get UUID from title, brand, quantity_original and quantity_original_unit
// This is probably very less than ideal
const getUUIDfromKey = (key: string, seed: string): string => {
  const keyArray = [key, seed];
  const keyJoined = keyArray.join("");

  return getUUID(keyJoined);
};

const getProduct = (
  search: ProductSearchData | GenericSearchData,
  seed: string,
  barcode: string
): Product => {
  const isGeneric = "category" in search;

  const parsedType = isGeneric ? "search_generic" : "search_product";
  const parsedKey = isGeneric
    ? search.title + search.category
    : search.title +
      search.brand +
      search.quantity_original +
      search.quantity_original_unit;

  const parsedUuid = getUUIDfromKey(parsedKey, seed);

  return {
    type: parsedType,
    uuid: parsedUuid,
    search,
    estimated: false,
    processing: true,

    title: null,
    brand: null,
    user_id: null,
    serving: null,
    options: null,
    barcode: barcode,
    category: null,
    quantity: null,
    embedding: null,

    icon_id: null,
    iron_100g: null,
    fiber_100g: null,
    sodium_100g: null,
    protein_100g: null,
    calorie_100g: null,
    calcium_100g: null,
    potassium_100g: null,
    cholesterol_100g: null,
    carbohydrate_100g: null,
    carbohydrate_sugar_100g: null,

    fat_100g: null,
    fat_trans_100g: null,
    fat_saturated_100g: null,
    fat_unsaturated_100g: null,

    updated_at: null,
    created_at: new Date().toISOString(),
  };
};
