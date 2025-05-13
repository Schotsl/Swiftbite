import OpenFoodFacts from "@openfoodfacts/openfoodfacts-nodejs";
import { generateEmbedding } from "./openai";
import { ProductSearchData } from "@/schema";
import { supabase } from "./supabase";
import { ProductSearch } from "@/types";

export const fatsecretRequest = async (query: string, signal: AbortSignal) => {
  const timeStart = performance.now();

  const url = `https://www.googleapis.com/customsearch/v1?key=AIzaSyD6bBggQl1M810Ev11F6V5RCV6TKtfPIVo&cx=95e21b8a439b147f9&q=${query}&fields=items.title,items.link,items.snippet`;
  const response = await fetch(url, { signal });
  const parsed = await response.json();
  const results = parsed.items;

  const timeEnd = performance.now();
  const timeDiff = Math.round(timeEnd - timeStart);

  console.log(`[SEARCH] Fatsecret request took ${timeDiff}ms`);

  return results;
};

export const googleRequest = async (query: string, signal: AbortSignal) => {
  const timeStart = performance.now();

  const url = `https://www.googleapis.com/customsearch/v1?key=AIzaSyD6bBggQl1M810Ev11F6V5RCV6TKtfPIVo&cx=e245e29713fe4444b&q=${query}&fields=items.title,items.link,items.snippet`;
  const response = await fetch(url, { signal });
  const parsed = await response.json();
  const results = parsed.items;

  const timeEnd = performance.now();
  const timeDiff = Math.round(timeEnd - timeStart);

  console.log(`[SEARCH] Google request took ${timeDiff}ms`);

  return results;
};

export const openfoodRequest = async (
  query: string,
  lang: string,
  signal: AbortSignal
) => {
  const timeStart = performance.now();

  const url = "https://search.openfoodfacts.org/search";
  const method = "POST";
  const headers = { "Content-Type": "application/json" };
  const body = JSON.stringify({
    q: query,
    lang: lang,
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
  });

  const response = await fetch(url, {
    body,
    signal,
    method,
    headers,
  });

  const parsed = await response.json();
  const results = parsed.hits;

  // Remove duplicates brand labels from openfoodItems
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const minimized = results.map((item: any) => {
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

  const timeEnd = performance.now();
  const timeDiff = Math.round(timeEnd - timeStart);

  console.log(`[SEARCH] Openfood request took ${timeDiff}ms`);

  return minimized;
};

export const supabaseRequest = async (
  query: string
): Promise<ProductSearch[]> => {
  const vector = await generateEmbedding({ value: query });

  const { data: results } = await supabase.rpc("match_documents", {
    query_embedding: vector,
    match_threshold: 0.5,
    match_count: 10,
  });

  const resultsSafe = results || [];
  const resultsMapped = resultsSafe.map((result: any) => ({
    new: false,
    title: result.title,
    brand: result.brand,
    quantity_original: result.quantity.quantity,
    quantity_original_unit: result.quantity.option,
  }));

  return resultsMapped;
};
