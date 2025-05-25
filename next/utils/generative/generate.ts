import { temperature } from "@/variables";
import {
  embed,
  generateObject,
  experimental_generateImage as generateImage,
} from "ai";

import generateIconPrompt from "@/prompts/generate-icon";
import generateOptionsPrompt from "@/prompts/generate-options";

import { after } from "next/dist/server/after";
import { insertUsage } from "@/utils/usage";
import { openai as openaiModel } from "@ai-sdk/openai";
import { OptionData, optionSchema } from "@/schema";

export async function generateOptions(
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
): Promise<OptionData[]> {
  const model = openaiModel("gpt-4o-mini");
  const task = "generate-options";

  const { object, usage } = await generateObject({
    model,
    temperature,

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
  user: string,
  {
    title,
  }: {
    title: string;
  },
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
  user: string,
  {
    value,
  }: {
    value: string;
  },
): Promise<number[]> {
  const model = openaiModel.embedding("text-embedding-3-small");

  const { embedding } = await embed({
    model,
    value,
  });

  return embedding;
}
