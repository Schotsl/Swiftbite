import { after } from "next/server";
import { insertUsage } from "../usage";
import { generateObject } from "ai";
import { ProductSearchData } from "@/schema";
import { productSearchSchema } from "@/schema";
import { providerOptions, temperature } from "@/variables";

import { google as googleModel } from "@ai-sdk/google";

import promptSearchBarcodeQuick from "@/prompts/search-barcode";

export async function searchBarcode(
  user: string,
  {
    barcode,
    google,
    openfood,
    fatsecret,
  }: {
    barcode: string;
    google: unknown[];
    openfood: unknown[];
    fatsecret: unknown[];
  },
  signal?: AbortSignal,
): Promise<ProductSearchData | null> {
  const task = "search-barcode";
  const model = googleModel("gemini-2.5-pro-preview-05-06");

  const { object, usage } = await generateObject({
    model,
    temperature,
    providerOptions,

    output: "object",
    schema: productSearchSchema.optional().nullable(),
    abortSignal: signal,

    messages: [
      {
        role: "system",
        content: promptSearchBarcodeQuick,
      },
      {
        role: "system",
        content:
          openfood.length > 0
            ? `Open Food Facts results: ${JSON.stringify(openfood)}`
            : "No Open Food Facts results found for this barcode",
      },
      {
        role: "system",
        content:
          google.length > 0
            ? `Google results: ${JSON.stringify(google)}`
            : "No Google results found for this barcode",
      },
      {
        role: "system",
        content:
          fatsecret.length > 0
            ? `Fatsecret results: ${JSON.stringify(fatsecret)}`
            : "No Fatsecret results found for this barcode",
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `Product information: ${JSON.stringify({
              barcode,
            })}`,
          },
        ],
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
    await Promise.all([
      insertUsage({
        user,
        task,
        usage,
        model: model.modelId,
      }),
    ]);
  });

  return object || null;
}
