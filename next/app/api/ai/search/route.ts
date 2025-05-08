import { getUser } from "@/utils/supabase";
import { NextRequest, NextResponse } from "next/server";
import { searchProducts } from "@/utils/openai";
import { streamToResponse } from "@/helper";

export async function GET(request: NextRequest) {
  const user = await getUser(request);

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

  const fatsecretUrl = `https://www.googleapis.com/customsearch/v1?key=AIzaSyD6bBggQl1M810Ev11F6V5RCV6TKtfPIVo&cx=95e21b8a439b147f9&q=${query}&fields=items.title,items.link,items.snippet`;
  const fatsecretRequest = fetch(fatsecretUrl);

  const googleUrl = `https://www.googleapis.com/customsearch/v1?key=AIzaSyD6bBggQl1M810Ev11F6V5RCV6TKtfPIVo&cx=e245e29713fe4444b&q=${query}&fields=items.title,items.link,items.snippet`;
  const googleRequest = fetch(googleUrl);

  const openfoodUrl = "https://search.openfoodfacts.org/search";
  const openfoodMethod = "POST";
  const openfoodHeaders = { "Content-Type": "application/json" };
  const openfoodBody = {
    q: query,
    page: 1,
    page_size: 32,
    fields: [
      "code",
      "lang",
      "brands",
      "brands_tags",
      "quantity",
      "countries_tags",
      "product_name",
      "product_name_en",
      "product_name_nl",
      "product_name_fr",
      "product_name_de",
      "product_name_it",
      "product_name_es",
      "product_name_pt",
      "product_name_ru",
      "product_name_pl",
      "product_name_tr",
      "generic_name",
      "generic_name_en",
      "generic_name_nl",
      "generic_name_fr",
      "generic_name_de",
      "generic_name_it",
      "generic_name_es",
      "generic_name_pt",
      "generic_name_ru",
      "generic_name_pl",
      "generic_name_tr",
    ],
  };

  const openfoodRequest = fetch(openfoodUrl, {
    method: openfoodMethod,
    headers: openfoodHeaders,
    body: JSON.stringify(openfoodBody),
  });

  const [googleResponse, openfoodResponse, fatsecretResponse] =
    await Promise.all([googleRequest, openfoodRequest, fatsecretRequest]);

  const [googleData, openfoodData, fatsecretData] = await Promise.all([
    googleResponse.json(),
    openfoodResponse.json(),
    fatsecretResponse.json(),
  ]);

  const googleItems = googleData.items;
  const openfoodItems = openfoodData.hits;
  const fatsecretItems = fatsecretData.items;

  // Remove duplicates brand labels from openfoodItems
  const openfoodMapped = openfoodItems.map((item: any) => {
    const brands = item.brands || [];
    const brandsTags = item.brands_tags || [];
    const brandsCombined = [...brands, ...brandsTags];
    const brandsUnique = brandsCombined.filter(
      (brand, index, self) =>
        index === self.findIndex((t) => t.toLowerCase() === brand.toLowerCase())
    );

    delete item.brands_tags;
    delete item.brands;

    return { ...item, brands: brandsUnique };
  });

  const googleStringified = JSON.stringify(googleItems);
  const openfoodStringified = JSON.stringify(openfoodMapped);
  const fatsecretStringified = JSON.stringify(fatsecretItems);

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

  const response = streamToResponse(stream);
  return response;
}
