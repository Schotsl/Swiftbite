import {
  ProductSearch,
  ProductGenerativeNutrition,
  ProductInsert,
} from "@/types";
import { generateObject, generateText, streamObject } from "ai";
import { openai as openai } from "@ai-sdk/openai";
import { google } from "@ai-sdk/google";
import { z } from "zod";
import { after } from "next/server";
import { insertUsage } from "./usage";
import { Enums } from "@/database.types";

export async function estimateNutrition(
  user: string,
  url: string
): Promise<ProductGenerativeNutrition> {
  const task: Enums<"task"> = "nutrition_estimation";
  const model = "gpt-4o";

  const response = await generateObject({
    model: openai(model),
    output: "object",
    schema: z.object({
      fat_100g: z.number().describe("Estimated total fat per 100g in grams"),
      calorie_100g: z.number().describe("Estimated calories per 100g"),
      protein_100g: z.number().describe("Estimated protein per 100g in grams"),
      serving: z
        .number()
        .describe("Estimated serving size in grams or milliliters"),
      serving_unit: z
        .string()
        .describe("Unit for the serving size (e.g., gram, milliliter)"),
      sodium_100g: z
        .number()
        .describe("Estimated sodium per 100g in milligrams"),
      carbohydrate_100g: z
        .number()
        .describe("Estimated carbohydrates per 100g in grams"),

      calcium_100g: z
        .number()
        .describe("Estimated calcium per 100g in milligrams")
        .optional(),
      carbohydrate_sugar_100g: z
        .number()
        .describe("Estimated sugar content per 100g in grams")
        .optional(),
      cholesterol_100g: z
        .number()
        .describe("Estimated cholesterol per 100g in milligrams")
        .optional(),
      fat_saturated_100g: z
        .number()
        .describe("Estimated saturated fat per 100g in grams")
        .optional(),
      fat_trans_100g: z
        .number()
        .describe("Estimated trans fat per 100g in grams")
        .optional(),
      fat_unsaturated_100g: z
        .number()
        .describe("Estimated unsaturated fat per 100g in grams")
        .optional(),
      fiber_100g: z
        .number()
        .describe("Estimated fiber per 100g in grams")
        .optional(),
      iron_100g: z
        .number()
        .describe("Estimated iron per 100g in milligrams")
        .optional(),
      potassium_100g: z
        .number()
        .describe("Estimated potassium per 100g in milligrams")
        .optional(),
    }),
    messages: [
      {
        role: "system",
        content:
          "You are a nutritionist. Estimate the nutritional values for the food in the image. In your response, please ensure that every property name is completely in lowercase.",
      },
      {
        role: "user",
        content: [{ type: "image", image: new URL(url) }],
      },
    ],
  });

  const { object, usage } = response;

  after(async () => {
    await insertUsage({
      user,
      task,
      model,
      usage,
    });
  });

  return {
    ...object,

    iron_100g: object.iron_100g ?? null,
    fiber_100g: object.fiber_100g ?? null,
    calcium_100g: object.calcium_100g ?? null,
    potassium_100g: object.potassium_100g ?? null,
    cholesterol_100g: object.cholesterol_100g ?? null,

    fat_saturated_100g: object.fat_saturated_100g ?? null,
    fat_trans_100g: object.fat_trans_100g ?? null,
    fat_unsaturated_100g: object.fat_unsaturated_100g ?? null,
    carbohydrate_sugar_100g: object.carbohydrate_sugar_100g ?? null,

    serving_unit: object.serving_unit as Enums<"unit">,
  };
}

export async function searchProduct(
  user: string,
  title: string,
  lang: string,
  brand: string,
  quantity: string
): Promise<ProductInsert | null> {
  const searchModel = "gpt-4o";
  const structureModel = "gpt-4o";

  const searchResponse = await generateText({
    model: openai.responses(searchModel),
    messages: [
      {
        role: "system",
        content:
          'You are a product data assistant. Use the `web_search_preview` tool to find the single best product match for the user query, don\'t forget to add search terms like "nutrition" or "voedingswaarde" based on the language. Extract the product title, brand, serving size, and full nutritional information. Return this data as plain text. If no suitable match is found, try to find similar products via web search and *approximate* the nutritional values based on those similar products. Clearly state in your text response if the nutritional values are approximated',
      },
      {
        role: "user",
        content: `title: ${title}, brand: ${brand}, quantity: ${quantity}`,
      },
    ],
    tools: {
      web_search_preview: openai.tools.webSearchPreview({
        searchContextSize: "high",
        userLocation: {
          type: "approximate",
          country: lang,
        },
      }),
    },
  });

  const nutritionText = searchResponse.text;
  console.log(nutritionText);

  if (nutritionText.includes("NO_MATCH")) {
    return null;
  }

  const structureResponse = await generateObject({
    model: openai(structureModel),
    output: "object",
    schema: z.object({
      title: z.string().describe("Product title"),
      brand: z.string().describe("Product brand"),
      estimated: z
        .boolean()
        .describe("True if nutritional values are estimated"),
      fat_100g: z.number().describe("Total fat per 100g in grams"),
      calorie_100g: z.number().describe("Calories per 100g"),
      protein_100g: z.number().describe("Protein per 100g in grams"),
      serving: z.number().describe("Serving size in grams or milliliters"),
      serving_unit: z
        .string()
        .describe("Unit for the serving size (e.g., gram, milliliter)"),
      sodium_100g: z.number().describe("Sodium per 100g in milligrams"),
      carbohydrate_100g: z.number().describe("Carbohydrates per 100g in grams"),
      calcium_100g: z.number().describe("Calcium per 100g in milligrams"),
      carbohydrate_sugar_100g: z
        .number()
        .describe("Sugar content per 100g in grams"),
      cholesterol_100g: z
        .number()
        .describe("Cholesterol per 100g in milligrams"),
      fat_saturated_100g: z
        .number()
        .describe("Saturated fat per 100g in grams"),
      fat_trans_100g: z.number().describe("Trans fat per 100g in grams"),
      fat_unsaturated_100g: z
        .number()
        .describe("Unsaturated fat per 100g in grams"),
      fiber_100g: z.number().describe("Fiber per 100g in grams"),
      iron_100g: z.number().describe("Iron per 100g in milligrams"),
      potassium_100g: z.number().describe("Potassium per 100g in milligrams"),
    }),
    messages: [
      {
        role: "system",
        content:
          "You are a data processing assistant. Convert the provided text containing product information (title, brand, serving size, nutrition) into a structured JSON object matching the required schema. Ensure all property names are lowercase. Use 0 for missing optional values.",
      },
      {
        role: "user",
        content: nutritionText,
      },
    ],
  });

  const { object } = structureResponse;
  console.log(object);
  return {
    ...object,

    serving_unit: object.serving_unit as Enums<"unit">,

    iron_100g: object.iron_100g ?? null,
    fiber_100g: object.fiber_100g ?? null,
    calcium_100g: object.calcium_100g ?? null,
    potassium_100g: object.potassium_100g ?? null,
    cholesterol_100g: object.cholesterol_100g ?? null,

    fat_trans_100g: object.fat_trans_100g ?? null,
    fat_saturated_100g: object.fat_saturated_100g ?? null,
    fat_unsaturated_100g: object.fat_unsaturated_100g ?? null,
    carbohydrate_sugar_100g: object.carbohydrate_sugar_100g ?? null,
    type: "estimation",
    image: null,
    icon_id: null,
    openfood_id: null,
    micros_100g: null,
  };
}

export async function searchProducts(
  user: string,
  query: string,
  lang: string
) {
  const searchModel = openai.responses("gpt-4o");
  const searchResponse = await generateText({
    model: searchModel,
    messages: [
      {
        role: "system",
        content:
          "You are a product search assistant that gathers specific product information to pass along to another AI. Use the `web_search_preview` tool to find multiple relevant products based on the user query. If the query is broad, return diverse results. For each product found, format its details strictly as: `title: [Product Title], brand: [Product Brand], quantity: [Product Quantity with Unit]`. List each product on a new line or clearly separate them. Do not include any other information or introductory/concluding text. If you start repeating yourself, stop the response.",
      },
      {
        role: "user",
        content: query,
      },
    ],
    tools: {
      web_search_preview: openai.tools.webSearchPreview({
        searchContextSize: "low",
        userLocation: {
          type: "approximate",
          country: lang,
        },
      }),
    },
  });
  console.log(searchResponse.text);
  const structureModel = openai("gpt-4o");
  const structureStream = streamObject({
    model: structureModel,
    output: "array",
    schema: z.object({
      title: z.string().describe("Product title"),
      brand: z.string().describe("Product brand"),
      quantity: z
        .string()
        .describe(
          'Product quantity as a string including unit (e.g., "180g", "250ml")'
        ),
    }),
    messages: [
      {
        role: "system",
        content:
          'You are a data processing assistant. Convert the provided plain text listing product details (formatted as `title: ..., brand: ..., quantity: ...`) into a stream of objects, each matching the required schema (title, brand, quantity as string). If the input text is empty, indicates no products were found (e.g., contains "NO_MATCH"), or cannot be reliably parsed, stream an empty array `[]` and stop.',
      },
      {
        role: "user",
        content: searchResponse.text,
      },
    ],
  });

  return structureStream;
}

export async function normalizeTitle(
  user: string,
  title: string
): Promise<string> {
  const task: Enums<"task"> = "title_normalization";
  const model = "gpt-4o-mini";

  const response = await generateObject({
    model: openai("gpt-4o-mini"),
    output: "object",
    schema: z.object({
      normalized_title: z.string().describe("Normalized food title"),
    }),
    messages: [
      {
        role: "system",
        content:
          "You are responsible for normalizing food titles so they can be matched with icons or generated as images when they don't exist. The input may be in any language and is typically a short food title such as 'spaghetti carbonada' or 'Spaghetti aglio e olio'. The output should be a clear, simplified description of the food item. For example, 'Quaker Cruesli cookies & cream' becomes 'a box of cereal', and 'KFC 32 Zinger Hot Wings bucket' becomes 'a bucket of chicken'. Keep descriptions singular—'fries' should become something like 'a serving of fries' or 'a packet of fries'. Company-specific items like 'Big Mac' should be generalized to 'a hamburger'\n\nAdditionally, when the food is served in a container (such as a bowl, bucket, or plate) or is traditionally presented with culturally specific tableware, include that container in the description rendered in color to ensure contrast with a white background. For example, if cereal is traditionally served in a bowl, the output should be 'a colored bowl of cereal', and if the food is served in a bucket, it should be 'a colored bucket filled with chicken'. For items that are traditionally served on a plate—such as spaghetti—simplify the input to a description like 'a colored plate of spaghetti'. For items that are normally consumed without container details (such as a sport drink or a hamburger), simply describe the food item without adding container details.\n\nFor other complex descriptors—such as 'isometric sport drink'—remove extraneous adjectives so that the description remains clear (for example, 'a sport drink'). This approach ensures that the final description is straightforward and generic, and that any container traditionally associated with the food is rendered with non-white tableware.",
      },
      {
        role: "user",
        content: title,
      },
    ],
  });

  const { object, usage } = response;

  after(async () => {
    await insertUsage({
      user,
      task,
      model,
      usage,
    });
  });

  const normalized = object.normalized_title;
  const normalizedLowercase = normalized.toLowerCase();

  return normalizedLowercase;
}

export function cleanProducts(
  user: string,
  query: string,
  language: string,
  products: ProductSearch[],
  abortSignal: AbortSignal
) {
  const task: Enums<"task"> = "search_normalization";
  const model = "gemini-2.0-flash";

  const json = JSON.stringify(products);
  const stream = streamObject({
    model: google("gemini-2.0-flash"),
    output: "array",
    schema: z.object({
      title: z.string().describe("Cleaned product name"),
      brand: z.string().describe("Brand name(s)"),
      quantity: z.string().describe("Quantity or size descriptor"),
      openfood_id: z.string().describe("Product barcode or unique identifier"),
    }),
    messages: [
      {
        role: "system",
        content:
          "You are a food database expert responsible for cleaning and optimizing search results. Your tasks are to:\n\n" +
          "1. Filter out irrelevant/spam: remove products with clearly incorrect or spam-like names.\n\n" +
          "2. Remove duplicates: if multiple entries represent the same product, keep only the highest quality version (use nutriments / categories data to pick the best).\n\n" +
          '3. Discard multi-packs: exclude product sets (e.g., "Coca-Cola 8 x 250 ml") when an equivalent individual item is available.\n\n' +
          '4. Discard unquantifiable items: remove entries with vague or non-standard quantities such as "1 piece" or similar descriptors that can\'t be accurately tracked.\n\n' +
          "5. Maintain quality & uniqueness: ensure the final list is clear, consistent, and free of redundancy.\n\n" +
          "6. Correct language & spelling: fix spelling, grammar, capitalization, and punctuation.\n\n" +
          "7. Enforce relevance: use the user's query to decide what products to keep — only include products that meaningfully match the query.\n\n" +
          '8. Standardize quantity format: ensure all quantity values are written consistently as a number followed by a **space** and then the unit label (e.g., "250 ml", "100 g").\n\n' +
          "Return clean fields only: final output should include only title, brand, quantity and openfood_id fields.\n\n\n\n" +
          "Your goal is to produce a high-quality, consistent set of results matching the user's search terms in the specified language (unless the user's query uses a different language), whenever possible.",
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `User query: ${query}\nUser language: ${language}\nProducts: ${json}`,
          },
        ],
      },
    ],
    abortSignal,
  });

  after(async () => {
    const usage = await stream.usage;
    await insertUsage({
      user,
      task,
      model,
      usage,
    });
  });

  return stream;
}
