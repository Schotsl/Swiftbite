import { OpenAI } from "openai";

const openai = new OpenAI();

export async function fetchEstimation(url: string) {
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: [
          {
            type: "text",
            text: "You are a nutritionist. Estimate the nutritional values for the food in the image. In your response, please ensure that every property name is completely in lowercase.",
          },
        ],
      },
      {
        role: "user",
        content: [
          {
            type: "image_url",
            image_url: {
              url,
            },
          },
        ],
      },
    ],
    tools: [
      {
        type: "function",
        function: {
          name: "nutritional_estimation",
          description:
            "Returns an estimation of the nutritional values per 100g of the identified food item in the image.",
          parameters: {
            type: "object",
            properties: {
              calcium_100g: {
                type: "number",
                description: "Estimated calcium per 100g in milligrams",
              },
              calorie_100g: {
                type: "number",
                description: "Estimated calories per 100g",
              },
              carbohydrate_100g: {
                type: "number",
                description: "Estimated carbohydrates per 100g in grams",
              },
              carbohydrate_sugar_100g: {
                type: "number",
                description: "Estimated sugar content per 100g in grams",
              },
              cholesterol_100g: {
                type: "number",
                description: "Estimated cholesterol per 100g in milligrams",
              },
              fat_100g: {
                type: "number",
                description: "Estimated total fat per 100g in grams",
              },
              fat_saturated_100g: {
                type: "number",
                description: "Estimated saturated fat per 100g in grams",
              },
              fat_trans_100g: {
                type: "number",
                description: "Estimated trans fat per 100g in grams",
              },
              fat_unsaturated_100g: {
                type: "number",
                description: "Estimated unsaturated fat per 100g in grams",
              },
              fiber_100g: {
                type: "number",
                description: "Estimated fiber per 100g in grams",
              },
              iron_100g: {
                type: "number",
                description: "Estimated iron per 100g in milligrams",
              },
              micros_100g: {
                type: "object",
                description:
                  "Estimated micronutrients per 100g (vitamins, minerals, etc.)",
              },
              portion: {
                type: "number",
                description: "Estimated serving size in grams or milliliters",
              },
              potassium_100g: {
                type: "number",
                description: "Estimated potassium per 100g in milligrams",
              },
              protein_100g: {
                type: "number",
                description: "Estimated protein per 100g in grams",
              },
              sodium_100g: {
                type: "number",
                description: "Estimated sodium per 100g in milligrams",
              },
            },
            required: [
              "calorie_100g",
              "protein_100g",
              "fat_100g",
              "carbohydrate_100g",
              "sodium_100g",
            ],
          },
        },
      },
    ],
    tool_choice: {
      type: "function",
      function: { name: "nutritional_estimation" },
    },
  });

  const responseRaw =
    response.choices[0].message.tool_calls![0].function.arguments;

  const responseParsed = JSON.parse(responseRaw);
  return responseParsed;
}

export async function fetchTitle(url: string) {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "You are a food expert. Identify the food item in the image and provide only its name using regular capitalization.",
      },
      {
        role: "user",
        content: [
          {
            type: "image_url",
            image_url: {
              url,
            },
          },
        ],
      },
    ],
  });

  const title = response.choices[0].message.content!;
  return title;
}

export async function normalizeTitle(title: string) {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `You are responsible for normalizing food titles so they can be matched with icons or generated as images when they don't exist. The input can be in any language, and the output should be a clear, simplified description of the food item. For example, "Quaker Cruesli cookies & cream" would become "a colored bowl of cruesli" while "KFC 32 Zinger Hot Wings bucket" might be transformed into "a colored bucket of chicken.", "AH Zoete kleine appeltjes" might be transformed into "an apple". Keep descriptions singular—"fries" should become something like "a serving of fries" or "a colored packet of fries." Company-specific items like "Big Mac" should be generalized, so they become "a hamburger"\n\nAdditionally, when the food is served in a container (such as a bowl, bucket, or plate), specify that the container is colored. For example, if the meal is cereal, the output should be "a colored bowl of cereal," and if it is a KFC bucket, it should be "a colored bucket filled with chicken." This ensures that the container contrasts with a white background.\n\nFor complex items with extra descriptors—such as "isometric sport drink"—simplify them by focusing on the core food item. In that case, "isometric sport drink" should be normalized to "a colored sport drink."`,
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
