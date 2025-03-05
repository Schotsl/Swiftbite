import { OpenAI } from "openai";

const openai = new OpenAI();

export async function generateIcon(title: string) {
  const image = await openai.images.generate({
    size: "1024x1024",
    model: "dall-e-3",
    style: "vivid",
    prompt:
      `prompt the text to Dall-e exactly, with no modifications: high quality simple and minimal 3d render, feature a piece of ${title}, made of plasticine, on a plain white background, perfect and simple composition, realistic and bright color palette, rendered with octane and global illumination, ambient occlusion, ray tracing, color mapping, no to minimal shadows on the right side and a low angle from below, the ${title} should take up most of the frame`,
    response_format: "b64_json",
  });

  return image.data[0].b64_json!;
}

export async function normalizeTitle(title: string) {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          `You are responsible for normalizing food titles to ensure they can be matched with icons or generated as images when they don't exist. The input can be in any language, and the output should be a clear, simplified description of the food item. For example, "Quaker Cruesli cookies & cream" would become "a box of cereal," while "KFC 32 Zinger Hot Wings bucket" might be transformed into "a bucket of chicken." Keep descriptions singular—"fries" should become something like "a serving of fries" or "a packet of fries." Company-specific items like "Big Mac" should be generalized, so it would become "a hamburger.".`,
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: title,
          },
        ],
      },
    ],
  });

  const titleNormalized = response.choices[0].message.content!;
  const titleLowercase = titleNormalized.toLowerCase();

  return titleLowercase;
}
