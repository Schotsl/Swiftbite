import { after } from "next/server";
import { insertUsage } from "@/utils/usage";
import { generateObject, streamObject, StreamObjectResult } from "ai";
import {
  GenericData,
  genericSchema,
  GenericSearchData,
  genericSearchSchema,
} from "@/schema";

import {
  GoogleGenerativeAIProviderOptions,
  google as googleModel,
} from "@ai-sdk/google";

import searchGenericPrompt from "@/prompts/search-generic";
import searchGenericsPrompt from "@/prompts/search-generics";

export async function searchGenerics(
  user: string | null,
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
  const model = googleModel("gemini-2.5-flash-preview-05-20");

  const genericStream = streamObject({
    model,
    temperature: 0,
    // providerOptions: {
    //   google: {
    //     thinkingConfig: {
    //       thinkingBudget: 2048,
    //     },
    //   } satisfies GoogleGenerativeAIProviderOptions,
    // },

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

export async function searchGeneric(
  user: string | null,
  {
    title,
    category,
  }: {
    title: string;
    category: string;
  },
): Promise<GenericData> {
  const task = "search-generic";
  const model = googleModel("gemini-2.5-pro-preview-05-06", {
    useSearchGrounding: true,
  });

  const { object, usage } = await generateObject({
    model,
    temperature: 0,

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

  after(async () => {
    await insertUsage({
      user,
      task,
      usage,
      model: model.modelId,
      grounding: true,
    });
  });

  return object;
}
