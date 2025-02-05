import { OpenAI } from "openai";
import { Estimation } from "../../types";

const openai = new OpenAI();

export async function fetchEstimation(base64: string): Promise<Estimation> {
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "You are a nutritionist. Estimate the calories of the food in the image.",
          },
          {
            type: "image_url",
            image_url: {
              url: `data:image/jpeg;base64,${base64}`,
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
            "Returns an estimation of the nutritional values of the identified food item in the image.",
          parameters: {
            type: "object",
            properties: {
              calories: {
                type: "number",
                description: "Estimated total calories in kcal",
              },
              protein: {
                type: "number",
                description: "Estimated protein in grams",
              },
              fat: {
                type: "number",
                description: "Estimated fat in grams",
              },
              carbohydrates: {
                type: "number",
                description: "Estimated carbohydrates in grams",
              },
              sugars: {
                type: "number",
                description: "Estimated sugar content in grams",
              },
              fiber: {
                type: "number",
                description: "Estimated fiber content in grams",
              },
              saturated_fat: {
                type: "number",
                description: "Estimated saturated fat content in grams",
              },
              unsaturated_fat: {
                type: "number",
                description: "Estimated unsaturated fat content in grams",
              },
              cholesterol: {
                type: "number",
                description: "Estimated cholesterol content in milligrams",
              },
              sodium: {
                type: "number",
                description: "Estimated sodium content in milligrams",
              },
              potassium: {
                type: "number",
                description: "Estimated potassium content in milligrams",
              },
              calcium: {
                type: "number",
                description: "Estimated calcium content in milligrams",
              },
              iron: {
                type: "number",
                description: "Estimated iron content in milligrams",
              },
              weight: {
                type: "number",
                description: "Estimated serving size in grams or milliliters",
              },
            },
            required: [
              "calories",
              "protein",
              "fat",
              "carbohydrates",
              "sugars",
              "fiber",
              "sodium",
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

export async function fetchTitle(base64: string): Promise<string> {
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
              url: `data:image/jpeg;base64,${base64}`,
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
