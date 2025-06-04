import {
  embed,
  generateObject,
  experimental_generateImage as generateImage,
} from "ai";

import generateIconPrompt from "@/prompts/generate-icon";
import generateOptionsPrompt from "@/prompts/generate-options";

import { after } from "next/dist/server/after";
import { insertUsage } from "@/utils/usage";
import { providerFast } from "@/variables";
import { OptionData, optionSchema } from "@/schema";

import { openai as openaiModel } from "@ai-sdk/openai";
import { google as googleModel } from "@ai-sdk/google";

export async function generateOptions(
  user: string | null,
  {
    title,
    brand,
    category,
  }: {
    title: string;
    brand?: string;
    category?: string;
  }
): Promise<OptionData[]> {
  const model = googleModel("gemini-2.5-flash-preview-05-20");
  const task = "generate-options";

  const { object, usage } = await generateObject({
    model,
    temperature: 0,
    providerOptions: providerFast,

    output: "array",
    schema: optionSchema,
    messages: [
      {
        role: "system",
        content: generateOptionsPrompt,
      },
      {
        role: "user",
        content: `Input: ${JSON.stringify({
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

  return object;
}

export async function generateIcon(
  user: string | null,
  {
    title,
  }: {
    title: string;
  }
): Promise<Buffer> {
  const { image } = await generateImage({
    size: "1024x1024",
    model: openaiModel.image("gpt-image-1"),
    prompt: generateIconPrompt(title),
    providerOptions: {
      openai: { quality: "medium", background: "transparent" },
    },
  });

  const resultBase64 = image.base64;
  const resultBytes = Buffer.from(resultBase64, "base64");

  return resultBytes;
}

export async function generateEmbedding(
  user: string | null,
  {
    value,
  }: {
    value: string;
  }
): Promise<number[]> {
  const model = openaiModel.embedding("text-embedding-3-small");

  const { embedding } = await embed({
    model,
    value,
  });

  return embedding;
}
