import { searchProducts } from "@/utils/openai";
import { fatsecretRequest } from "@/utils/internet";
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

  const [googleResponse, openfoodResponse, fatsecretResponse] =
    await Promise.all([
      googleRequest(query, signal),
      openfoodRequest(query, lang, signal),
      fatsecretRequest(query, signal),
    ]);

  const googleStringified = JSON.stringify(googleResponse);
  const openfoodStringified = JSON.stringify(openfoodResponse);
  const fatsecretStringified = JSON.stringify(fatsecretResponse);

  const stream = await searchProducts(
    user!,
    {
      query,
      lang,
      google: googleStringified,
      openfood: openfoodStringified,
      fatsecret: fatsecretStringified,
    },
    request.signal
  );

  after(async () => {
    const results = await stream.object;
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
    });

    handleError(error);
  });

  const response = streamToResponse(stream);
  return response;
}
