import { searchProducts } from "@/utils/openai";
import { fatsecretRequest, supabaseRequest } from "@/utils/internet";
import { getUser, supabase } from "@/utils/supabase";
import { handleError, streamToResponse } from "@/helper";
import { googleRequest, openfoodRequest } from "@/utils/internet";
import { after, NextRequest, NextResponse } from "next/server";

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

  // Create a stream for Supabase results
  const supabaseStream = {
    partialObjectStream: (async function* () {
      yield supabaseResponse;
    })(),
  };

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

  // Create a combined stream
  const combinedStream = {
    partialObjectStream: (async function* () {
      const data = [];

      for await (const chunk of supabaseStream.partialObjectStream) {
        if (chunk.length === 0) {
          continue;
        }

        data.push(...chunk);

        yield data;
      }

      for await (const chunk of generativeStream.partialObjectStream) {
        if (chunk.length === 0) {
          continue;
        }

        const mapped = chunk.map((result) => {
          return {
            new: true,
            ...result,
          };
        });

        data.push(...mapped);
        yield data;
      }
    })(),
  };

  after(async () => {
    const results = await generativeStream.object;
    const resultsMapped = results.map((result) => {
      return {
        uuid: crypto.randomUUID(),
        search_title: result.title,
        search_brand: result.brand,
        search_quantity_original: result.quantity_original,
        search_quantity_original_unit: result.quantity_original_unit,
      };
    });

    const { error } = await supabase.from("test").insert(resultsMapped);

    resultsMapped.forEach(async (result) => {
      const params = new URLSearchParams({
        uuid: result.uuid,
        lang,
        title: result.search_title,
        brand: result.search_brand,
      });

      if (result.search_quantity_original) {
        params.set(
          "quantity_original",
          result.search_quantity_original.toString()
        );
      }

      if (result.search_quantity_original_unit) {
        params.set(
          "quantity_original_unit",
          result.search_quantity_original_unit
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

      fetch(
        `${process.env.SWIFTBITE_API_URL}/api/ai-server/product-embedding?${params.toString()}`,
        {
          headers,
        }
      );
    });

    handleError(error);
  });

  const response = streamToResponse([combinedStream]);
  return response;
}
