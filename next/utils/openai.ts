import { z } from "zod";
import { after } from "next/server";
import { Enums } from "@/database.types";
import { insertUsage } from "./usage";
import { openai as openai } from "@ai-sdk/openai";
import { CoreMessage, generateObject, generateText, streamObject } from "ai";

import {
  productGenerativeNutritionSchema,
  productGenerativeVisualsSchema,
  productSchema,
  productSearchSchema,
  quantitySchema,
} from "@/schema";

import {
  ProductGenerativeNutrition,
  ProductInsert,
  ProductGenerativeVisuals,
} from "@/types";

import normalizeQuantityPrompt from "@/prompts/normalize-quantity";

import searchProductCrawlerPrompt from "@/prompts/search-product-crawler";
import searchProductStructurePrompt from "@/prompts/search-product-structure";

import searchProductsCrawlerPrompt from "@/prompts/search-products-crawler";
import searchProductsStructurePrompt from "@/prompts/search-products-structure";

export async function estimateNutrition(
  user: string,
  content: {
    image: string | null;
    title: string | null;
    content: string | null;
  },
  signal?: AbortSignal
): Promise<ProductGenerativeNutrition> {
  const task: Enums<"task"> = "nutrition_estimation";
  const model = "gpt-4o";

  const messages: CoreMessage[] = [];

  if (content.image) {
    messages.push({
      role: "user",
      content: [{ type: "image", image: new URL(content.image) }],
    });
  }

  if (content.title) {
    messages.push({
      role: "user",
      content: `Title: ${content.title}`,
    });
  }

  if (content.content) {
    messages.push({
      role: "user",
      content: `Details: ${content.content}`,
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
        content:
          "You are a nutritionist. Estimate the nutritional values for the provided food item based on the image, title, and/or details. In your response, please ensure that every property name is completely in lowercase.",
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

  return {
    ...object,

    estimated: true,
  };
}

export async function estimateVisuals(
  user: string,
  content: {
    image: string | null;
    title: string | null;
    content: string | null;
  },
  signal?: AbortSignal
): Promise<ProductGenerativeVisuals> {
  const task: Enums<"task"> = "title_generation";
  const model = openai("gpt-4o-mini");

  const messages: CoreMessage[] = [];

  if (content.image) {
    messages.push({
      role: "user",
      content: [{ type: "image", image: new URL(content.image) }],
    });
  }

  if (content.title) {
    messages.push({
      role: "user",
      content: `Title: ${content.title}`,
    });
  }

  if (content.content) {
    messages.push({
      role: "user",
      content: `Details: ${content.content}`,
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
        content:
          "You are a food expert. If a title is provided, use that title. Identify the food item based on the image and/or details provided. Provide only its name and try to identify the brand (if discernible, otherwise return null) using regular capitalization, so make sure to capitalize the first letter.",
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
  title: string,
  lang: string,
  brand: string,
  quantity_original: string,
  quantity_original_unit: string,
  signal?: AbortSignal
): Promise<ProductInsert | null> {
  const searchModel = openai.responses("gpt-4o");
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
        content: `title: ${title}, brand: ${brand}, quantity: ${quantity_original} ${quantity_original_unit}`,
      },
    ],
    tools: {
      web_search_preview: openai.tools.webSearchPreview({
        searchContextSize: "high",
        userLocation: {
          type: "approximate",
          country: lang,
        },
      }),
    },
  });

  const structureModel = openai.responses("gpt-4o-mini");
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

  const { object } = structureResponse;
  return {
    ...object,

    image: null,
    icon_id: null,
  };
}

export async function searchProducts(
  user: string,
  query: string,
  lang: string,
  signal?: AbortSignal
) {
  const searchModel = openai.responses("gpt-4o");
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
        content: query,
      },
    ],
    tools: {
      web_search_preview: openai.tools.webSearchPreview({
        searchContextSize: "low",
        userLocation: {
          type: "approximate",
          country: lang,
        },
      }),
    },
  });

  const structureModel = openai("gpt-4o-mini");
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

  return structureStream;
}

export async function normalizeTitle(
  user: string,
  title: string,
  signal?: AbortSignal
): Promise<string> {
  const task: Enums<"task"> = "title_normalization";
  const model = "gpt-4o-mini";

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
        content:
          "You are responsible for normalizing food titles so they can be matched with icons or generated as images when they don't exist. The input may be in any language and is typically a short food title such as 'spaghetti carbonada' or 'Spaghetti aglio e olio'. The output should be a clear, simplified description of the food item. For example, 'Quaker Cruesli cookies & cream' becomes 'a box of cereal', and 'KFC 32 Zinger Hot Wings bucket' becomes 'a bucket of chicken'. Keep descriptions singular—'fries' should become something like 'a serving of fries' or 'a packet of fries'. Company-specific items like 'Big Mac' should be generalized to 'a hamburger'\n\nAdditionally, when the food is served in a container (such as a bowl, bucket, or plate) or is traditionally presented with culturally specific tableware, include that container in the description rendered in color to ensure contrast with a white background. For example, if cereal is traditionally served in a bowl, the output should be 'a colored bowl of cereal', and if the food is served in a bucket, it should be 'a colored bucket filled with chicken'. For items that are traditionally served on a plate—such as spaghetti—simplify the input to a description like 'a colored plate of spaghetti'. For items that are normally consumed without container details (such as a sport drink or a hamburger), simply describe the food item without adding container details.\n\nFor other complex descriptors—such as 'isometric sport drink'—remove extraneous adjectives so that the description remains clear (for example, 'a sport drink'). This approach ensures that the final description is straightforward and generic, and that any container traditionally associated with the food is rendered with non-white tableware.",
      },
      {
        role: "user",
        content: title,
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
  quantity: {
    unit: string;
    numeric: string;
    combined: string;
  },
  signal?: AbortSignal
): Promise<{
  quantity_original: number | null;
  quantity_original_unit: string | null;
  quantity_gram: number | null;
}> {
  // If no combined or unit is provided there is no way to know the original unit
  if (!quantity.combined && !quantity.unit) {
    return {
      quantity_original: null,
      quantity_original_unit: null,
      quantity_gram: null,
    };
  }

  const task: Enums<"task"> = "quantity_normalization";
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
        content: JSON.stringify(quantity),
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
