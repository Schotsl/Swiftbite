import { Enums } from "@/database.types";
import { Product } from "@/types";
import { getUser, supabase } from "@/utils/supabase";
import { searchGenerics, searchProducts } from "@/utils/openai";
import { handleError, streamToResponse } from "@/helper";
import { googleRequest, openfoodRequest } from "@/utils/internet";
import { after, NextRequest, NextResponse } from "next/server";
import { fatsecretRequest, supabaseRequest } from "@/utils/internet";
import { GenericSearchData, ProductSearchData } from "@/schema";
import { processSearchGeneric, processSearchProduct } from "@/utils/processing";

export async function GET(request: NextRequest) {
  const user = await getUser(request);
  const signal = request.signal;

  const lang = request.nextUrl.searchParams.get("lang");
  const type = request.nextUrl.searchParams.get("type") as Enums<"type">;
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

  if (!type) {
    return NextResponse.json(
      { error: "Please provide a type" },
      { status: 400 },
    );
  }

  const promises = [googleRequest(query, signal), supabaseRequest(query, type)];

  if (type === "search_product") {
    promises.push(openfoodRequest(query, lang, signal));
    promises.push(fatsecretRequest(query, signal));
  }

  // Get all the data first
  const [
    googleResponse,
    supabaseResponse,
    openfoodResponse,
    fatsecretResponse,
  ] = await Promise.all(promises);

  // Create a stream for AI results
  const generativeStream =
    type === "search_product"
      ? await searchProducts(
          user!,
          {
            query,
            lang,
            google: JSON.stringify(googleResponse),
            openfood: JSON.stringify(openfoodResponse),
            fatsecret: JSON.stringify(fatsecretResponse),
          },
          {
            products: supabaseResponse.map((product: Product) => ({
              title: product.title,
              brand: product.brand,
              quantity_original: product.quantity?.quantity,
              quantity_original_unit: product.quantity?.option,
            })),
          },
          request.signal,
        )
      : await searchGenerics(
          user!,
          {
            query,
            lang,
            google: JSON.stringify(googleResponse),
          },
          {
            generic: supabaseResponse.map((product: Product) => ({
              title: product.title,
              category: product.category,
            })),
          },
          request.signal,
        );

  after(async () => {
    const results = await generativeStream.object;
    const resultsMapped = results.map(getProduct);

    const { error } = await supabase.from("product").insert(resultsMapped);

    handleError(error);

    resultsMapped.forEach(async (result) => {
      if (result.type === "search_generic") {
        const search = result.search as GenericSearchData;
        processSearchGeneric(result.uuid, lang, search);

        return;
      }

      const search = result.search as ProductSearchData;
      processSearchProduct(result.uuid, lang, search);
    });
  });

  const combinedStream = {
    partialObjectStream: (async function* () {
      console.log("[SEARCH] Yielding Supabase results");

      // First yield the Supabase results
      yield supabaseResponse;

      // Then yield combined results as AI results come in
      for await (const chunk of generativeStream.partialObjectStream) {
        if (chunk.length === 0) {
          continue;
        }

        const mapped = chunk.map(getProduct);

        yield [...supabaseResponse, ...mapped];
      }

      // Close the stream after the last chunk
      console.log("[SEARCH] Closing stream");
    })(),
  };

  const response = streamToResponse(combinedStream);
  return response;
}

// Get UUID from title, brand, quantity_original and quantity_original_unit
// This function will take these search params and generate a UUID and store it in a local object so we can return the same uuid if it's requested later again

const uuids: { [key: string]: string } = {};

const getUUID = (key: string): string => {
  const uuid = crypto.randomUUID();

  uuids[key] = uuid;

  return uuid;
};

const getProduct = (search: ProductSearchData | GenericSearchData): Product => {
  const isGeneric = "category" in search;

  const parsedType = isGeneric ? "search_generic" : "search_product";
  const parsedUuid = getUUID(
    isGeneric
      ? search.title + search.category
      : search.title +
          search.brand +
          search.quantity_original +
          search.quantity_original_unit,
  );

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
    barcode: null,
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
