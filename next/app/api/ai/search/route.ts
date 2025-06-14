import * as crypto from "crypto";

import { Enums } from "@/database.types";
import { Product } from "@/types";
import { searchGenerics } from "@/utils/generative/generic";
import { searchProducts } from "@/utils/generative/product";
import { streamToResponse } from "@/helper";
import { getProductFromSearch } from "@/utils/search";
import { getUser, insertProducts } from "@/utils/supabase";
import { googleRequest, openfoodRequest } from "@/utils/internet";
import { after, NextRequest, NextResponse } from "next/server";
import { fatsecretRequest, supabaseRequest } from "@/utils/internet";
import { GenericSearchData, ProductSearchData } from "@/schema";
import { processSearchGeneric, processSearchProduct } from "@/utils/processing";

// I've given this function a very high timeout since it has to await a bunch further AI processing calls
export const maxDuration = 300;

export async function GET(request: NextRequest) {
  const user = await getUser(request);
  const signal = request.signal;
  const headers = request.headers;

  const seed = crypto.randomUUID();
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

  const promises = [
    googleRequest(query, signal),
    supabaseRequest(user, query, type),
  ];

  if (type === "search_product") {
    promises.push(openfoodRequest(query, lang, signal));
    promises.push(fatsecretRequest(query, signal));
  }

  // Get all the data in parallel first
  const [google, supabase, openfood, fatsecret] = await Promise.all(promises);

  const supabaseProducts = supabase as Product[];

  // Create a stream for AI results
  const generativeStream =
    type === "search_product"
      ? await searchProducts(
          user,
          {
            query,
            google,
            openfood,
            fatsecret,
          },
          {
            products: supabaseProducts.map(
              ({ title, brand, quantity }: Product) => ({
                title: title!,
                brand: brand!,
                quantity_original: quantity?.quantity,
                quantity_original_unit: quantity?.option,
              }),
            ),
          },
        )
      : await searchGenerics(
          user,
          {
            query,
            google,
          },
          {
            generics: supabaseProducts.map(({ title, category }: Product) => ({
              title: title!,
              category: category!,
            })),
          },
        );

  after(async () => {
    const results = await generativeStream.object;
    const resultsMapped = results.map((search) =>
      getProductFromSearch({ search, seed }),
    );

    // Normally we await the insert but since we won't automatically redirect to the user to product I'm assuming we'll insert before they click
    await insertProducts(resultsMapped);

    await Promise.all(
      resultsMapped.map(async (result) => {
        if (result.type === "search_generic") {
          const uuid = result.uuid;
          const search = result.search as GenericSearchData;

          await processSearchGeneric(headers, { uuid, lang, search });

          return;
        }

        const uuid = result.uuid;
        const search = result.search as ProductSearchData;

        await processSearchProduct(headers, { uuid, lang, search });
      }),
    );
  });

  const combinedStream = {
    partialObjectStream: (async function* () {
      console.log("[SEARCH] Yielding Supabase results");

      // First yield the Supabase results
      if (supabase.length > 0) {
        yield supabase;
      }

      // Then yield combined results as AI results come in
      for await (const chunk of generativeStream.partialObjectStream) {
        console.log(chunk);

        const mapped = chunk.map((search) =>
          getProductFromSearch({ search, seed }),
        );

        if (mapped.length > 0) {
          yield [...supabase, ...mapped];
        }
      }
    })(),
  };

  const response = streamToResponse(combinedStream);
  return response;
}
