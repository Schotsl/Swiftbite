import { after } from "next/server";
import { google } from "@ai-sdk/google";
import { insertUsage } from "../usage";
import { generateObject } from "ai";
import { ProductSearchData } from "@/schema";
import { productSearchSchema } from "@/schema";

import promptSearchBarcodeQuick from "@/prompts/search-barcode-quick";

export async function searchBarcodeQuick(
  user: string,
  data: {
    lang: string;
    google: string;
    barcode: string;
    openfood: string;
    fatsecret: string;
  },
  signal?: AbortSignal
): Promise<ProductSearchData> {
  const task = "search-barcode-quick";
  const model = google("gemini-2.5-pro-preview-03-25");

  const { object, usage } = await generateObject({
    model,
    output: "object",
    schema: productSearchSchema,
    temperature: 0,
    abortSignal: signal,
    providerOptions: {
      google: {
        thinkingConfig: {
          thinkingBudget: 0,
        },
      },
    },
    messages: [
      {
        role: "system",
        content: promptSearchBarcodeQuick,
      },
      {
        role: "system",
        content: `Open Food Facts results: ${JSON.stringify(data.openfood)}`,
      },
      {
        role: "system",
        content: `Google results: ${JSON.stringify(data.google)}`,
      },
      {
        role: "system",
        content: `Fatsecret results: ${JSON.stringify(data.fatsecret)}`,
      },
      {
        role: "user",
        content: JSON.stringify({
          lang: "Dutch",
          barcode: data.barcode,
          location: "Amsterdam",
          measurement: "Metric",
        }),
      },
    ],
  });

  console.log(object);

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

  return object;
}
