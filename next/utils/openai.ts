import { OpenAI } from "openai";
import { Stream } from "openai/streaming.mjs";
import { OpenFoodSearch } from "@/types";
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
        content: `You are responsible for normalizing food titles so they can be matched with icons or generated as images when they don't exist. The input may be in any language and is typically a short food title such as "spaghetti carbonada" or "Spaghetti aglio e olio". The output should be a clear, simplified description of the food item. For example, "Quaker Cruesli cookies & cream" becomes "a box of cereal", and "KFC 32 Zinger Hot Wings bucket" becomes "a bucket of chicken". Keep descriptions singular—"fries" should become something like "a serving of fries" or "a packet of fries". Company-specific items like "Big Mac" should be generalized to "a hamburger"\n\nAdditionally, when the food is served in a container (such as a bowl, bucket, or plate) or is traditionally presented with culturally specific tableware, include that container in the description rendered in color to ensure contrast with a white background. For example, if cereal is traditionally served in a bowl, the output should be "a colored bowl of cereal", and if the food is served in a bucket, it should be "a colored bucket filled with chicken". For items that are traditionally served on a plate—such as spaghetti—simplify the input to a description like "a colored plate of spaghetti". For items that are normally consumed without container details (such as a sport drink or a hamburger), simply describe the food item without adding container details.\n\nFor other complex descriptors—such as "isometric sport drink"—remove extraneous adjectives so that the description remains clear (for example, "a sport drink"). This approach ensures that the final description is straightforward and generic, and that any container traditionally associated with the food is rendered with non-white tableware.`,
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

export async function fetchPortionSize(url: string) {
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: [
          {
            type: "text",
            text: "You are a nutritionist specializing in portion size estimation. Estimate the weight in grams of the food shown in the image.",
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
          name: "portion_size_estimation",
          description:
            "Returns an estimation of the total weight in grams of the food shown in the image.",
          parameters: {
            type: "object",
            properties: {
              portion_grams: {
                type: "number",
                description:
                  "Estimated total weight in grams of the food shown",
              },
            },
            required: ["portion_grams"],
          },
        },
      },
    ],
    tool_choice: {
      type: "function",
      function: { name: "portion_size_estimation" },
    },
  });

  const responseRaw =
    response.choices[0].message.tool_calls![0].function.arguments;

  const responseParsed = JSON.parse(responseRaw);
  return responseParsed;
}

export async function cleanSearchResults(
  products: OpenFoodSearch[],
  query: string,
  language: string,
  signal: AbortSignal
): Promise<Stream<OpenAI.Chat.Completions.ChatCompletionChunk>> {
  const json = JSON.stringify(products);
  const stream = openai.chat.completions.create(
    {
      model: "gpt-4o-mini",
      stream: true,
      messages: [
        {
          role: "system",
          content:
            "You are a food database expert responsible for cleaning and optimizing search results. Your tasks are to:\n\n" +
            "1. Filter out irrelevant/spam: remove products with clearly incorrect or spam-like names\n" +
            "2. Remove duplicates: if multiple entries represent the same product, keep only the highest quality version (use nutriments / categories data to pick the best).\n" +
            '3. Discard multi-packs: exclude product sets (e.g., "Coca-Cola 8 x 250ml") when an equivalent individual item is available.\n' +
            "4. Maintain quality & uniqueness: ensure the final list is clear, consistent, and free of redundancy.\n" +
            "5. Correct language & spelling: fix spelling, grammar, capitalization, and punctuation.\n" +
            "6. Enforce relevance: Use the user's query to decide what products to keep, only include products that meaningfully match the query.\n" +
            "7. Return clean fields: final output should only contain:\n" +
            "   - code: product barcode or unique identifier\n" +
            "   - brands: brand name(s)\n" +
            "   - product_name: cleaned product name\n" +
            "   - quantity: quantity or size descriptor\n\n" +
            "Your goal is to produce a high-quality, consistent set of results matching the user's search terms in the specified language (unless the users query uses a different language), whenever possible.",
        },
        {
          role: "user",
          content:
            `User query: ${query}\n` +
            `User language: ${language}\n` +
            `Products: ${json}\n`,
        },
      ],
      tools: [
        {
          type: "function",
          function: {
            name: "return_cleaned_products",
            description: "Returns a cleaned and filtered list of food products",
            parameters: {
              type: "object",
              properties: {
                cleaned_products: {
                  type: "array",
                  description: "Filtered, cleaned, and deduplicated products",
                  items: {
                    type: "object",
                    properties: {
                      code: {
                        type: "string",
                        description: "Product barcode",
                      },
                      brands: {
                        type: "string",
                        description: "Product brands",
                      },
                      product_name: {
                        type: "string",
                        description: "Cleaned product name",
                      },
                      quantity: {
                        type: "string",
                        description: "Product quantity",
                      },
                    },
                    required: ["code", "brands", "product_name", "quantity"],
                  },
                },
              },
              required: ["cleaned_products"],
            },
          },
        },
      ],
      tool_choice: {
        type: "function",
        function: { name: "return_cleaned_products" },
      },
    },
    {
      signal,
    }
  );

  return stream;
}
