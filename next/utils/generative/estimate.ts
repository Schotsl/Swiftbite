import {
  ProductGenerativeNutritionData,
  productGenerativeNutritionSchema,
  ProductGenerativeVisualsData,
  productGenerativeVisualsSchema,
} from "@/schema";
import { temperature } from "@/variables";
import { CoreMessage, generateObject } from "ai";

import estimateNutritionPrompt from "@/prompts/estimate-nutrition";
import estimateVisualPrompt from "@/prompts/estimate-visual";

import { google as googleModel } from "@ai-sdk/google";
import { after } from "next/server";
import { insertUsage } from "../usage";

export async function estimateNutrition(
  user: string | null,
  {
    image,
    title,
    content,
  }: {
    image?: string;
    title?: string;
    content?: string;
  },
  signal?: AbortSignal
): Promise<ProductGenerativeNutritionData> {
  const task = "estimate-nutrition";
  const model = googleModel("gemini-2.5-pro-preview-05-06");

  const messages: CoreMessage[] = [];

  if (image) {
    messages.push({
      role: "user",
      content: [{ type: "image", image: new URL(image) }],
    });
  }

  if (title || image) {
    messages.push({
      role: "user",
      content: `Estimation information: ${JSON.stringify({
        title,
        content,
        language: "Dutch",
      })}`,
    });
  }

  const { object, usage } = await generateObject({
    model,
    temperature,

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

  after(async () => {
    await insertUsage({
      user,
      task,
      usage,
      model: model.modelId,
    });
  });

  return object;
}

export async function estimateVisuals(
  user: string | null,
  {
    image,
    title,
    content,
  }: {
    image?: string;
    title?: string;
    content?: string;
  },
  signal?: AbortSignal
): Promise<ProductGenerativeVisualsData> {
  const task = "estimate-visuals";
  const model = googleModel("gemini-2.5-flash-preview-05-20");

  const messages: CoreMessage[] = [];

  if (image) {
    messages.push({
      role: "user",
      content: [{ type: "image", image: new URL(image) }],
    });
  }

  if (title || image) {
    messages.push({
      role: "user",
      content: `Estimation information: ${JSON.stringify({
        title,
        content,
        language: "Dutch",
      })}`,
    });
  }

  const { object, usage } = await generateObject({
    model,
    temperature,

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

  after(async () => {
    await insertUsage({
      user,
      task,
      usage,
      model: model.modelId,
    });
  });

  return object;
}
