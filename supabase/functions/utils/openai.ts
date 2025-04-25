import { insertUsage } from "./usage.ts";
import { generateText } from "npm:ai";
import { openai as openai } from "npm:@ai-sdk/openai";

import generateVisionPrompt from "../prompts/generate-vision.ts";

export async function generateVision(
  user: string,
  data: {
    base64: string;
  }
) {
  const task = "generate-vision";
  const model = "gpt-4.1-nano";

  const response = await generateText({
    model: openai(model),
    messages: [
      {
        role: "system",
        content: generateVisionPrompt,
      },
      {
        role: "user",
        content: [
          {
            type: "image",
            image: `data:image/png;base64,${data.base64}`,
          },
        ],
      },
    ],
  });

  const { usage, text } = response;

  const after = async () => {
    await insertUsage({
      user,
      task,
      model,
      usage,
    });
  };

  after();

  return text;
}
