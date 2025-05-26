import { after } from "next/server";
import { insertUsage } from "@/utils/usage";
import { temperature, providerOptions } from "@/variables";
import { generateObject, streamObject, StreamObjectResult } from "ai";
import {
  ProductData,
  productSchema,
  ProductSearchData,
  productSearchSchema,
} from "@/schema";

import { google as googleModel } from "@ai-sdk/google";

import searchProductPrompt from "@/prompts/search-product";
import searchProductsPrompt from "@/prompts/search-products";

export async function searchProducts(
  user: string | null,
  {
    query,
    google,
    openfood,
    fatsecret,
  }: {
    query: string;
    google: unknown[];
    openfood: unknown[];
    fatsecret: unknown[];
  },
  {
    products,
  }: {
    products: ProductSearchData[];
  },
  signal?: AbortSignal,
): Promise<
  StreamObjectResult<
    ProductSearchData[],
    ProductSearchData[],
    AsyncIterable<ProductSearchData> & ReadableStream<ProductSearchData>
  >
> {
  const task = "search-products";
  const model = googleModel("gemini-2.5-pro-preview-05-06");

  const stream = streamObject({
    model,
    temperature,
    providerOptions,

    output: "array",
    schema: productSearchSchema,
    abortSignal: signal,

    messages: [
      {
        role: "system",
        content: searchProductsPrompt,
      },
      {
        role: "system",
        content:
          products.length > 0
            ? `Database results: ${JSON.stringify(products)}`
            : "No database results found for this query",
      },
      {
        role: "system",
        content:
          openfood.length > 0
            ? `Open Food Facts results: ${JSON.stringify(openfood)}`
            : "No Open Food Facts results found for this query",
      },
      {
        role: "system",
        content:
          google.length > 0
            ? `Google results: ${JSON.stringify(google)}`
            : "No Google results found for this query",
      },
      {
        role: "system",
        content:
          fatsecret.length > 0
            ? `Fatsecret results: ${JSON.stringify(fatsecret)}`
            : "No Fatsecret results found for this query",
      },
      {
        role: "user",
        content: JSON.stringify({
          query,
          language: "Dutch",
          location: "Amsterdam",
          measurement: "Metric",
        }),
      },
    ],
    onError: (error) => {
      throw error.error;
    },
  });

  after(async () => {
    // Wait for the stream to finish
    const usage = await stream.usage;

    await Promise.all([
      insertUsage({
        user,
        task,
        usage,
        model: model.modelId,
      }),
    ]);
  });

  return stream;
}

export async function searchProduct(
  user: string | null,
  {
    brand,
    title,
    barcode,
    quantity_original,
    quantity_original_unit,
  }: {
    brand: string;
    title: string;
    barcode?: string;
    quantity_original?: number;
    quantity_original_unit?: string;
  },
): Promise<ProductData> {
  const task = "search-product";
  const model = googleModel("gemini-2.5-pro-preview-05-06", {
    useSearchGrounding: true,
  });

  const { object, usage } = await generateObject({
    model,
    temperature,

    output: "object",
    schema: productSchema,

    messages: [
      {
        role: "system",
        content: searchProductPrompt,
      },
      {
        role: "user",
        content: `Product information: ${JSON.stringify({
          title,
          brand,
          quantity_original,
          quantity_original_unit,
          barcode,
        })}`,
      },
      {
        role: "user",
        content: `User information: ${JSON.stringify({
          language: "Dutch",
          location: "Amsterdam",
          measurement: "Metric",
        })}`,
      },
    ],
  });

  after(async () => {
    await insertUsage({
      user,
      task,
      usage,
      model: model.modelId,
      grounding: true,
    });
  });

  return object;
}
