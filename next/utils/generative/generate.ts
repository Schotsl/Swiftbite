import OpenAI from "openai";

import { temperature } from "@/variables";
import { embed, generateObject } from "ai";
import { OptionData, optionSchema } from "@/schema";

import { openai as openaiModel } from "@ai-sdk/openai";

import generateIconPrompt from "@/prompts/generate-icon";
import generateOptionsPrompt from "@/prompts/generate-options";

export async function generateOptions({
  title,
  brand,
  category,
}: {
  title: string;
  brand?: string;
  category?: string;
}): Promise<OptionData[]> {
  const model = openaiModel("gpt-4o-mini");

  const { object } = await generateObject({
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

  return object;
}

export async function generateIcon({ title }: { title: string }) {
  const openai = new OpenAI();
  const result = await openai.images.generate({
    size: "1024x1024",
    model: "gpt-image-1",
    prompt: generateIconPrompt(title),
    quality: "medium",
    background: "transparent",
  });

  const resultBase64 = result.data![0].b64_json!;
  const resultBytes = Buffer.from(resultBase64, "base64");

  return resultBytes;
}

export async function generateEmbedding({
  value,
}: {
  value: string;
}): Promise<number[]> {
  const model = openaiModel.embedding("text-embedding-3-small");

  const { embedding } = await embed({
    model,
    value,
  });

  return embedding;
}
