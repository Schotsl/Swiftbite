import { Enums } from "@/database.types";
import { Product } from "@/types";
import { supabase } from "./supabase";
import { handleError } from "@/helper";
import { generateEmbedding } from "./generative/generate";

export const fatsecretRequest = async (
  query: string,
  signal: AbortSignal,
  retries = 1,
): Promise<unknown[]> => {
  try {
    console.log("[SEARCH] Fatsecret request started");

    const timeStart = performance.now();

    const url = `https://www.googleapis.com/customsearch/v1?key=AIzaSyD6bBggQl1M810Ev11F6V5RCV6TKtfPIVo&cx=95e21b8a439b147f9&q=${query}&fields=items.title,items.link,items.snippet`;
    const response = await fetch(url, { signal });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const parsed = await response.json();
    const results = parsed.items;

    const timeEnd = performance.now();
    const timeDiff = Math.round(timeEnd - timeStart);

    console.log(`[SEARCH] Fatsecret request took ${timeDiff}ms`);

    const resultsSafe = results || [];
    return resultsSafe;
  } catch {
    if (retries > 0) {
      return fatsecretRequest(query, signal, retries - 1);
    }

    return [];
  }
};

export const googleRequest = async (
  query: string,
  signal: AbortSignal,
  retries = 1,
): Promise<unknown[]> => {
  try {
    console.log("[SEARCH] Google request started");

    const timeStart = performance.now();

    const url = `https://www.googleapis.com/customsearch/v1?key=AIzaSyD6bBggQl1M810Ev11F6V5RCV6TKtfPIVo&cx=e245e29713fe4444b&q=${query}&fields=items.title,items.link,items.snippet`;
    const response = await fetch(url, { signal });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const parsed = await response.json();
    const results = parsed.items;

    const timeEnd = performance.now();
    const timeDiff = Math.round(timeEnd - timeStart);

    console.log(`[SEARCH] Google request took ${timeDiff}ms`);

    const resultsSafe = results || [];
    return resultsSafe;
  } catch {
    if (retries > 0) {
      return googleRequest(query, signal, retries - 1);
    }
    return [];
  }
};

export const openfoodRequest = async (
  query: string,
  lang: string,
  signal: AbortSignal,
  retries = 1,
): Promise<unknown[]> => {
  try {
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

    console.log("[SEARCH] Openfood request started");

    const response = await fetch(url, {
      body,
      signal,
      method,
      headers,
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

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
          index ===
          self.findIndex((t) => t.toLowerCase() === brand.toLowerCase()),
      );

      delete item.brands_tags;
      delete item.brands;

      return { ...item, brands: brandsUnique };
    });

    const timeEnd = performance.now();
    const timeDiff = Math.round(timeEnd - timeStart);

    console.log(`[SEARCH] Openfood request took ${timeDiff}ms`);

    const minimizedSafe = minimized || [];
    return minimizedSafe;
  } catch {
    if (retries > 0) {
      return openfoodRequest(query, lang, signal, retries - 1);
    }
    return [];
  }
};

export const supabaseRequest = async (
  user: string | null,
  value: string,
  type: Enums<"type">,
  retries = 1,
): Promise<Product[]> => {
  try {
    const timeStart = performance.now();
    console.log("[DEBUG] Attempting to generate embedding");
    const vector = await generateEmbedding(user, { value });

    console.log("[DEBUG] Attempting to match product");
    const { data, error: rpcError } = await supabase.rpc("product_match", {
      query_embedding: vector,
      query_type: type,
      match_threshold: 0.6,
      match_count: 6,
    });

    if (rpcError) {
      handleError(rpcError);
      throw rpcError;
    }

    const timeEnd = performance.now();
    const timeDiff = Math.round(timeEnd - timeStart);

    console.log(`[SEARCH] Supabase request took ${timeDiff}ms`);

    const resultsSafe = data || [];
    return resultsSafe;
  } catch {
    if (retries > 0) {
      return supabaseRequest(user, value, type, retries - 1);
    }

    return [];
  }
};
