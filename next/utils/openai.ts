import { OpenAI } from "openai";

const openai = new OpenAI();

export async function fetchEstimation(url: string) {
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "You are a nutritionist. Estimate the nutritional values for the food in the image.",
          },
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
    tools: [
      {
        type: "function",
        function: {
          name: "food_identification",
          description:
            "Returns the name of the identified food item in the image.",
          parameters: {
            type: "object",
            properties: {
              title: {
                type: "string",
                description: "Title of the identified food item",
              },
            },
            required: ["title"],
          },
        },
      },
    ],
    tool_choice: {
      type: "function",
      function: { name: "food_identification" },
    },
  });

  const responseRaw =
    response.choices[0].message.tool_calls![0].function.arguments;

  const responseParsed = JSON.parse(responseRaw);
  const responseTitle = responseParsed.title;

  return responseTitle;
}
