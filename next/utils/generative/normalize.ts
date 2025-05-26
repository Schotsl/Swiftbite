import { after } from "next/server";
import { insertUsage } from "../usage";
import { temperature } from "@/variables";
import { generateObject } from "ai";
import { QuantityData, quantitySchema, titleSchema } from "@/schema";

import { google as googleModel } from "@ai-sdk/google";

import normalizeMealPrompt from "@/prompts/normalize-meal";
import normalizeTitlePrompt from "@/prompts/normalize-title";
import normalizeQuantityPrompt from "@/prompts/normalize-quantity";

export async function normalizeMeal(
  user: string | null,
  {
    title,
    ingredients,
  }: {
    title: string;
    ingredients: string[];
  },
  signal?: AbortSignal
): Promise<string> {
  const task = "normalize-meal";
  const model = googleModel("gemini-2.5-flash-preview-05-20");

  console.log("1, ?");

  try {
    const { object, usage } = await generateObject({
      model,
      temperature,

      output: "object",
      schema: titleSchema,
      abortSignal: signal,

      messages: [
        {
          role: "system",
          content: normalizeMealPrompt,
        },
        {
          role: "user",
          content: `Meal information: ${JSON.stringify({
            title,
            language: "Dutch",
            ingredients,
          })}`,
        },
      ],
    });

    console.log("2, ?");
    console.log(object);

    after(async () => {
      await insertUsage({
        user,
        task,
        usage,
        model: model.modelId,
      });
    });

    const normalized = object.title;
    const normalizedLowercase = normalized.toLowerCase();

    return normalizedLowercase;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function normalizeTitle(
  user: string,
  {
    title,
    brand,
    category,
  }: {
    title: string;
    brand?: string;
    category?: string;
  },
  signal?: AbortSignal
): Promise<string> {
  const task = "normalize-title";
  const model = googleModel("gemini-2.5-flash-preview-05-20");

  const { object, usage } = await generateObject({
    model,
    temperature,

    output: "object",
    schema: titleSchema,
    abortSignal: signal,

    messages: [
      {
        role: "system",
        content: normalizeTitlePrompt,
      },
      {
        role: "user",
        content: `Title information: ${JSON.stringify({
          title,
          brand,
          category,
          language: "Dutch",
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
    });
  });

  const normalized = object.title;
  const normalizedLowercase = normalized.toLowerCase();

  return normalizedLowercase;
}

export async function normalizeQuantity(
  user: string | null,
  {
    unit,
    numeric,
    combined,
  }: {
    unit: string;
    numeric: string;
    combined: string;
  },
  signal?: AbortSignal
): Promise<QuantityData> {
  // If no combined or unit is provided there is no way to know the original unit
  if (!combined && !unit) {
    return {
      quantity_original: null,
      quantity_original_unit: null,
      quantity_gram: null,
    };
  }

  const task = "normalize-quantity";
  const model = googleModel("gemini-2.5-flash-preview-05-20");

  const { object, usage } = await generateObject({
    model,
    temperature,

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
        content: `Quantity information: ${JSON.stringify({
          unit,
          numeric,
          combined,
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
    });
  });

  return object;
}
