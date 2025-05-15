import OpenAI from "openai";

import { z } from "zod";
import { after } from "next/server";
import { google } from "@ai-sdk/google";
import { insertUsage } from "./usage";
import { openai as openai } from "@ai-sdk/openai";
import {
  embed,
  CoreMessage,
  streamObject,
  generateObject,
  StreamObjectResult,
} from "ai";

import {
  GenericSearchData,
  genericSearchSchema,
  OptionData,
  optionSchema,
  ProductData,
  ProductGenerativeNutritionData,
  productGenerativeNutritionSchema,
  ProductGenerativeVisualsData,
  productGenerativeVisualsSchema,
  productSchema,
  ProductSearchData,
  productSearchSchema,
  QuantitySchema,
  quantitySchema,
} from "@/schema";

import genericSearchPrompt from "@/prompts/search-generic";
import generateIconPrompt from "@/prompts/generate-icon";
import generateOptionsPrompt from "@/prompts/generate-options";
import normalizeQuantityPrompt from "@/prompts/normalize-quantity";
import normalizeTitlePrompt from "@/prompts/normalize-meal";
import normalizeProductPrompt from "@/prompts/normalize-product";
import searchProductsPrompt from "@/prompts/search-products";
import searchProductPrompt from "@/prompts/search-product";
import estimateVisualPrompt from "@/prompts/estimate-visual";
import estimateNutritionPrompt from "@/prompts/estimate-nutrition";

export async function estimateNutrition(
  user: string,
  data: {
    image: string | null;
    title: string | null;
    content: string | null;
  },
  signal?: AbortSignal,
): Promise<ProductGenerativeNutritionData> {
  const task = "estimate-nutrition";
  const model = "gpt-4o";

  const messages: CoreMessage[] = [];

  if (data.image) {
    messages.push({
      role: "user",
      content: [{ type: "image", image: new URL(data.image) }],
    });
  }

  if (data.title) {
    messages.push({
      role: "user",
      content: `Title: ${data.title}`,
    });
  }

  if (data.content) {
    messages.push({
      role: "user",
      content: `Details: ${data.content}`,
    });
  }

  const response = await generateObject({
    model: openai(model),
    output: "object",
    schema: productGenerativeNutritionSchema,
    abortSignal: signal,
    messages: [
      {
        role: "system",
        content: estimateNutritionPrompt,
      },
      ...messages,
    ],
  });

  const { object, usage } = response;

  after(async () => {
    await insertUsage({
      user,
      task,
      model,
      usage,
    });
  });

  return object;
}

export async function estimateVisuals(
  user: string,
  data: {
    image: string | null;
    title: string | null;
    content: string | null;
  },
  signal?: AbortSignal,
): Promise<ProductGenerativeVisualsData> {
  const task = "estimate-visuals";
  const model = google("gemini-2.5-pro-preview-03-25");

  const messages: CoreMessage[] = [];

  if (data.image) {
    messages.push({
      role: "user",
      content: [{ type: "image", image: new URL(data.image) }],
    });
  }

  if (data.title) {
    messages.push({
      role: "user",
      content: `Title: ${data.title}`,
    });
  }

  if (data.content) {
    messages.push({
      role: "user",
      content: `Details: ${data.content}`,
    });
  }

  const response = await generateObject({
    model,
    output: "object",
    schema: productGenerativeVisualsSchema,
    abortSignal: signal,
    messages: [
      {
        role: "system",
        content: estimateVisualPrompt,
      },
      ...messages,
    ],
  });

  const { usage, object } = response;

  after(async () => {
    await insertUsage({
      user,
      task,
      model: model.modelId,
      usage,
    });
  });

  return object;
}

export async function searchProduct(data: {
  lang: string;
  brand: string;
  title: string;
  quantity_original: number | null;
  quantity_original_unit: string | null;
}): Promise<ProductData | null> {
  const searchModel = google("gemini-2.5-pro-preview-03-25", {
    useSearchGrounding: true,
  });

  const searchResponse = await generateObject({
    model: searchModel,
    output: "object",
    schema: productSchema,
    temperature: 0,
    messages: [
      {
        role: "system",
        content: searchProductPrompt,
      },
      {
        role: "user",
        content: JSON.stringify(data),
      },
    ],
  });

  const { object } = searchResponse;
  return object;
}

export async function searchProducts(
  user: string,
  data: {
    lang: string;
    query: string;
    google: string;
    openfood: string;
    fatsecret: string;
  },
  system: {
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
  const structureTask = "search-products";
  const structureModel = google("gemini-2.5-pro-preview-03-25");

  const structureStream = streamObject({
    model: structureModel,
    output: "array",
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
        content: searchProductsPrompt,
      },
      {
        role: "system",
        content:
          system.products.length > 0
            ? `We've already found these database results: ${JSON.stringify(system.products)}`
            : "We've found no database results",
      },
      {
        role: "system",
        content: `Open Food Facts results: ${data.openfood}`,
      },
      {
        role: "system",
        content: `Google results: ${data.google}`,
      },
      {
        role: "system",
        content: `Fatsecret results: ${data.fatsecret}`,
      },
      {
        role: "user",
        content: JSON.stringify({
          lang: "Dutch",
          query: data.query,
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
    const usage = await structureStream.usage;

    await Promise.all([
      insertUsage({
        user,
        task: structureTask,
        model: structureModel.modelId,
        usage: usage,
      }),
    ]);
  });

  return structureStream;
}

export async function searchGeneric(
  user: string,
  data: {
    lang: string;
    query: string;
    google: string;
  },
  system: {
    generic: GenericSearchData[];
  },
  signal?: AbortSignal,
): Promise<
  StreamObjectResult<
    GenericSearchData[],
    GenericSearchData[],
    AsyncIterable<GenericSearchData> & ReadableStream<GenericSearchData>
  >
> {
  const genericTask = "search-generic";
  const genericModel = google("gemini-2.5-pro-preview-03-25");

  const genericStream = streamObject({
    model: genericModel,
    output: "array",
    schema: genericSearchSchema,
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
        content: genericSearchPrompt,
      },
      {
        role: "system",
        content:
          system.generic.length > 0
            ? `We've already found these database results: ${JSON.stringify(system.generic)}`
            : "We've found no database results",
      },
      {
        role: "system",
        content: `Google results: ${data.google}`,
      },
      {
        role: "user",
        content: JSON.stringify({
          lang: "Dutch",
          query: data.query,
          location: "Amsterdam",
          measurement: "Metric",
        }),
      },
    ],
  });

  after(async () => {
    const usage = await genericStream.usage;

    await insertUsage({
      user,
      task: genericTask,
      model: genericModel.modelId,
      usage,
    });
  });

  return genericStream;
}

export async function normalizeMeal(
  user: string,
  data: {
    title: string;
    ingredients: string[];
  },
  signal?: AbortSignal,
): Promise<string> {
  const task = "normalize-meal";
  const model = "gpt-4.1-mini";

  const response = await generateObject({
    model: openai(model),
    output: "object",
    schema: z.object({
      normalized_title: z.string().describe("Normalized meal title"),
    }),
    abortSignal: signal,
    messages: [
      {
        role: "system",
        content: normalizeProductPrompt,
      },
      {
        role: "user",
        content: JSON.stringify(data),
      },
    ],
  });

  const { object, usage } = response;

  after(async () => {
    await insertUsage({
      user,
      task,
      model,
      usage,
    });
  });

  const normalized = object.normalized_title;
  const normalizedLowercase = normalized.toLowerCase();

  return normalizedLowercase;
}

export async function normalizeTitle(
  // user: string,
  data: {
    title: string;
  },
  signal?: AbortSignal,
): Promise<string> {
  const model = "gpt-4.1-mini";

  const response = await generateObject({
    model: openai(model),
    output: "object",
    schema: z.object({
      normalized_title: z.string().describe("Normalized food title"),
    }),
    abortSignal: signal,
    messages: [
      {
        role: "system",
        content: normalizeTitlePrompt,
      },
      {
        role: "user",
        content: data.title,
      },
    ],
  });

  const { object } = response;

  // after(async () => {
  //   await insertUsage({
  //     user,
  //     task,
  //     model,
  //     usage,
  //   });
  // });

  const normalized = object.normalized_title;
  const normalizedLowercase = normalized.toLowerCase();

  return normalizedLowercase;
}

export async function normalizeQuantity(
  user: string,
  data: {
    unit: string;
    numeric: string;
    combined: string;
  },
  signal?: AbortSignal,
): Promise<QuantitySchema> {
  // If no combined or unit is provided there is no way to know the original unit
  if (!data.combined && !data.unit) {
    return {
      quantity_original: null,
      quantity_original_unit: null,
      quantity_gram: null,
    };
  }

  const task = "normalize-quantity";
  const model = "gpt-4.1-nano";

  const response = await generateObject({
    model: openai(model),
    output: "object",
    schema: quantitySchema,
    abortSignal: signal,
    messages: [
      {
        role: "system",
        content: normalizeQuantityPrompt,
      },
      {
        role: "user",
        content: JSON.stringify(data),
      },
    ],
  });

  const { object, usage } = response;

  after(async () => {
    await insertUsage({
      user,
      task,
      model,
      usage,
    });
  });

  return object;
}

export async function generateOptions(data: {
  lang: string;
  title: string;
  brand: string;
}): Promise<OptionData[]> {
  const model = "gpt-4.1-mini";

  const response = await generateObject({
    model: openai(model),
    output: "array",
    schema: optionSchema,
    messages: [
      {
        role: "system",
        content: generateOptionsPrompt,
      },
      {
        role: "user",
        content: JSON.stringify(data),
      },
    ],
  });

  const { object } = response;
  return object;
}

export async function generateIcon(data: { title: string }) {
  const openai = new OpenAI();

  const title = data.title;
  const result = await openai.images.generate({
    size: "1024x1024",
    model: "gpt-image-1",
    prompt: generateIconPrompt(title),
    quality: "high",
    background: "transparent",
  });

  const resultBase64 = result.data![0].b64_json!;
  const resultBytes = Buffer.from(resultBase64, "base64");

  return resultBytes;
}

export async function generateEmbedding(data: {
  value?: string;
}): Promise<number[]> {
  const model = openai.embedding("text-embedding-3-small");
  const { value } = data;
  const { embedding } = await embed({
    model,
    value,
  });

  return embedding;
}
