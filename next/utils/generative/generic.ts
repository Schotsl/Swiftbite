import { after } from "next/server";
import { insertUsage } from "@/utils/usage";
import { temperature, providerOptions } from "@/variables";
import { generateObject, streamObject, StreamObjectResult } from "ai";
import {
  GenericData,
  genericSchema,
  GenericSearchData,
  genericSearchSchema,
} from "@/schema";

import { google as googleModel } from "@ai-sdk/google";

import searchGenericPrompt from "@/prompts/search-generic";
import searchGenericsPrompt from "@/prompts/search-generics";

export async function searchGenerics(
  user: string,
  {
    query,
    google,
  }: {
    query: string;
    google: string;
  },
  {
    generics,
  }: {
    generics: GenericSearchData[];
  },
  signal?: AbortSignal,
): Promise<
  StreamObjectResult<
    GenericSearchData[],
    GenericSearchData[],
    AsyncIterable<GenericSearchData> & ReadableStream<GenericSearchData>
  >
> {
  const task = "search-generics";
  const model = googleModel("gemini-2.5-pro-preview-03-25");

  const genericStream = streamObject({
    model,
    temperature,
    providerOptions,

    output: "array",
    schema: genericSearchSchema,
    abortSignal: signal,

    messages: [
      {
        role: "system",
        content: searchGenericsPrompt,
      },
      {
        role: "system",
        content:
          generics.length > 0
            ? `Database results: ${JSON.stringify(generics)}`
            : "No database results found for this query",
      },
      {
        role: "system",
        content:
          google.length > 0
            ? `Google results: ${JSON.stringify(google)}`
            : "No Google results found for this query",
      },
      {
        role: "user",
        content: JSON.stringify({
          query,
          language: "Dutch",
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
      task,
      usage,
      model: model.modelId,
    });
  });

  return genericStream;
}

export async function searchGeneric({
  title,
  category,
}: {
  title: string;
  category: string;
}): Promise<GenericData> {
  const model = googleModel("gemini-2.5-pro-preview-03-25", {
    useSearchGrounding: true,
  });

  const { object } = await generateObject({
    model,
    temperature,

    output: "object",
    schema: genericSchema,
    messages: [
      {
        role: "system",
        content: searchGenericPrompt,
      },
      {
        role: "user",
        content: `Generic information: ${JSON.stringify({
          title,
          category,
        })}`,
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

  return object;
}
