import { searchProducts } from "@/utils/openai";
import { fatsecretRequest, supabaseRequest } from "@/utils/internet";
import { getUser, supabase } from "@/utils/supabase";
import { handleError, streamToResponse } from "@/helper";
import { googleRequest, openfoodRequest } from "@/utils/internet";
import { after, NextRequest, NextResponse } from "next/server";
import { Product, ProductInsert } from "@/types";
import { Tables } from "@/database.types";

export async function GET(request: NextRequest) {
  const user = await getUser(request);
  const signal = request.signal;

  const lang = request.nextUrl.searchParams.get("lang");
  const query = request.nextUrl.searchParams.get("query");

  if (!lang) {
    return NextResponse.json(
      { error: "Please provide a language" },
      { status: 400 }
    );
  }

  if (!query) {
    return NextResponse.json(
      { error: "Please provide a query" },
      { status: 400 }
    );
  }

  // Get all results first
  const [
    googleResponse,
    openfoodResponse,
    fatsecretResponse,
    supabaseResponse,
  ] = await Promise.all([
    googleRequest(query, signal),
    openfoodRequest(query, lang, signal),
    fatsecretRequest(query, signal),
    supabaseRequest(query),
  ]);

  const googleStringified = JSON.stringify(googleResponse);
  const openfoodStringified = JSON.stringify(openfoodResponse);
  const fatsecretStringified = JSON.stringify(fatsecretResponse);

  // Create a stream for AI results
  const generativeStream = await searchProducts(
    user!,
    {
      query,
      lang,
      google: googleStringified,
      openfood: openfoodStringified,
      fatsecret: fatsecretStringified,
    },
    {
      products: supabaseResponse,
    },
    request.signal
  );

  after(async () => {
    const results = await generativeStream.object;
    const resultsMapped = results.map((result) => {
      return {
        uuid: getUUID(result),
        title: null,
        brand: null,
        user_id: null,
        type: "search",
        quantity: null,
        serving: null,
        barcode: null,
        calcium_100g: null,
        carbohydrate_100g: null,
        cholesterol_100g: null,
        calorie_100g: null,
        carbohydrate_sugar_100g: null,
        embedding: null,
        estimated: false,
        fat_100g: null,
        fat_saturated_100g: null,
        fat_trans_100g: null,
        fat_unsaturated_100g: null,
        fiber_100g: null,
        iron_100g: null,
        icon_id: null,
        potassium_100g: null,
        protein_100g: null,
        sodium_100g: null,
        created_at: new Date().toISOString(),
        updated_at: null,
        options: null,
        search: {
          title: result.title,
          brand: result.brand,
          quantity_original: result.quantity_original,
          quantity_original_unit: result.quantity_original_unit,
        },
      } as Product;
    });

    const { error } = await supabase.from("product").insert(resultsMapped);

    handleError(error);

    resultsMapped.forEach(async (result) => {
      const params = new URLSearchParams({
        uuid: result.uuid,
        lang,
        title: result.search!.title,
        brand: result.search!.brand,
      });

      if (result.search!.quantity_original) {
        params.set(
          "quantity_original",
          result.search!.quantity_original.toString()
        );
      }

      if (result.search!.quantity_original_unit) {
        params.set(
          "quantity_original_unit",
          result.search!.quantity_original_unit
        );
      }

      const headers = {
        "X-Supabase-Secret": process.env.SWIFTBITE_WEBHOOK_SECRET!,
      };

      fetch(
        `${process.env.SWIFTBITE_API_URL}/api/ai-server/product-data?${params.toString()}`,
        {
          headers,
        }
      );

      fetch(
        `${process.env.SWIFTBITE_API_URL}/api/ai-server/product-options?${params.toString()}`,
        {
          headers,
        }
      );
    });
  });

  const combinedStream = {
    partialObjectStream: (async function* () {
      // First yield the Supabase results
      yield supabaseResponse;

      // Then yield combined results as AI results come in
      for await (const chunk of generativeStream.partialObjectStream) {
        if (chunk.length === 0) {
          continue;
        }

        const mapped = chunk.map((result) => ({
          new: true,
          uuid: getUUID(result),
          ...result,
        }));

        yield [...supabaseResponse, ...mapped];
      }
    })(),
  };

  const response = streamToResponse(combinedStream);
  return response;
}

// Get UUID from title, brand, quantity_original and quantity_original_unit
// This function will take these search params and generate a UUID and store it in a local object so we can return the same uuid if it's requested later again

const uuids: { [key: string]: string } = {};

const getUUID = ({
  title,
  brand,
  quantity_original,
  quantity_original_unit,
}: {
  title: string;
  brand: string;
  quantity_original?: number | null;
  quantity_original_unit?: string | null;
}): string => {
  const key = `${title}-${brand}-${quantity_original}-${quantity_original_unit}`;
  const uuid = crypto.randomUUID();

  uuids[key] = uuid;

  return uuid;
};
