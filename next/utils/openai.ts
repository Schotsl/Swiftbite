import OpenAI from "openai";

import { z } from "zod";
import { after } from "next/server";
import { insertUsage } from "./usage";
import { openai as openai } from "@ai-sdk/openai";
import {
  CoreMessage,
  generateText,
  streamObject,
  generateObject,
  StreamObjectResult,
} from "ai";

import {
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

import generateIconPrompt from "@/prompts/generate-icon";
import generateOptionsPrompt from "@/prompts/generate-options";
import normalizeQuantityPrompt from "@/prompts/normalize-quantity";
import normalizeTitlePrompt from "@/prompts/normalize-meal";
import normalizeProductPrompt from "@/prompts/normalize-product";
import searchProductCrawlerPrompt from "@/prompts/search-product-crawler";
import searchProductStructurePrompt from "@/prompts/search-product-structure";
import searchProductsCrawlerPrompt from "@/prompts/search-products-crawler";
import searchProductsStructurePrompt from "@/prompts/search-products-structure";
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
  const model = openai("gpt-4o-mini");

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

export async function searchProduct(
  user: string,
  data: {
    lang: string;
    brand: string;
    title: string;
    quantity_original: string;
    quantity_original_unit: string;
  },
  signal?: AbortSignal,
): Promise<ProductData | null> {
  const searchTask = "search-product";
  const searchModel = openai.responses("gpt-4.1-mini");

  const searchResponse = await generateText({
    model: searchModel,
    abortSignal: signal,
    messages: [
      {
        role: "system",
        content: searchProductCrawlerPrompt,
      },
      {
        role: "user",
        content: JSON.stringify(data),
      },
    ],
    tools: {
      web_search_preview: openai.tools.webSearchPreview({
        searchContextSize: "low",
        userLocation: {
          type: "approximate",
          country: data.lang,
        },
      }),
    },
  });

  const structureTask = "search-product-structure";
  const structureModel = openai.responses("gpt-4.1-nano");

  const structureResponse = await generateObject({
    model: structureModel,
    output: "object",
    schema: productSchema,
    abortSignal: signal,
    messages: [
      {
        role: "system",
        content: searchProductStructurePrompt,
      },
      {
        role: "user",
        content: searchResponse.text,
      },
    ],
  });

  after(async () => {
    await Promise.all([
      insertUsage({
        user,
        task: searchTask,
        model: searchModel.modelId,
        usage: searchResponse.usage,
      }),

      insertUsage({
        user,
        task: structureTask,
        model: structureModel.modelId,
        usage: structureResponse.usage,
      }),
    ]);
  });

  const { object } = structureResponse;
  return object;
}

export async function searchProducts(
  user: string,
  data: {
    query: string;
    lang: string;
  },
  signal?: AbortSignal,
): Promise<
  StreamObjectResult<
    ProductSearchData[],
    ProductSearchData[],
    AsyncIterable<ProductSearchData> & ReadableStream<ProductSearchData>
  >
> {
  const searchTask = "search-products";
  const searchModel = openai.responses("gpt-4.1-mini");

  const searchResponse = await generateText({
    model: searchModel,
    abortSignal: signal,
    messages: [
      {
        role: "system",
        content: searchProductsCrawlerPrompt,
      },
      {
        role: "user",
        content: JSON.stringify(data),
      },
    ],
    tools: {
      web_search_preview: openai.tools.webSearchPreview({
        searchContextSize: "low",
        userLocation: {
          type: "approximate",
          country: data.lang,
        },
      }),
    },
  });

  const structureTask = "search-products-structure";
  const structureModel = openai("gpt-4.1-nano");

  const structureStream = streamObject({
    model: structureModel,
    output: "array",
    schema: productSearchSchema,
    abortSignal: signal,
    messages: [
      {
        role: "system",
        content: searchProductsStructurePrompt,
      },
      {
        role: "user",
        content: searchResponse.text,
      },
    ],
  });

  after(async () => {
    // Wait for the stream to finish
    const usage = await structureStream.usage;

    await Promise.all([
      insertUsage({
        user,
        task: searchTask,
        model: searchModel.modelId,
        usage: searchResponse.usage,
      }),

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
  user: string,
  data: {
    title: string;
  },
  signal?: AbortSignal,
): Promise<string> {
  const task = "normalize-title";
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

export async function generateOptions(
  user: string,
  data: {
    lang: string;
    title: string;
  },
  signal?: AbortSignal,
): Promise<OptionData[]> {
  const task = "generate-options";
  const model = "gpt-4.1-nano";

  const response = await generateObject({
    model: openai(model),
    output: "array",
    schema: optionSchema,
    abortSignal: signal,
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
