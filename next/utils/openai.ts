import {
  ProductGenerativeNutrition,
  ProductInsert,
  ProductGenerativeVisuals,
} from "@/types";
import { generateObject, generateText, streamObject } from "ai";
import { openai as openai } from "@ai-sdk/openai";
import { z } from "zod";
import { after } from "next/server";
import { insertUsage } from "./usage";
import { Enums } from "@/database.types";
import {
  productGenerativeNutritionSchema,
  productGenerativeVisualsSchema,
  productSchema,
  productSearchSchema,
} from "@/schema";

export async function estimateNutrition(
  user: string,
  url: string,
): Promise<ProductGenerativeNutrition> {
  const task: Enums<"task"> = "nutrition_estimation";
  const model = "gpt-4o";

  const response = await generateObject({
    model: openai(model),
    output: "object",
    schema: productGenerativeNutritionSchema,
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

    serving_unit: object.serving_unit as Enums<"unit">,
    quantity_unit: object.quantity_unit as Enums<"unit">,

    iron_100g: object.iron_100g ?? null,
    fiber_100g: object.fiber_100g ?? null,
    calcium_100g: object.calcium_100g ?? null,
    potassium_100g: object.potassium_100g ?? null,
    cholesterol_100g: object.cholesterol_100g ?? null,

    fat_saturated_100g: object.fat_saturated_100g ?? null,
    fat_trans_100g: object.fat_trans_100g ?? null,
    fat_unsaturated_100g: object.fat_unsaturated_100g ?? null,
    carbohydrate_sugar_100g: object.carbohydrate_sugar_100g ?? null,
  };
}

export async function estimateVisuals(
  user: string,
  url: string,
): Promise<ProductGenerativeVisuals> {
  const task: Enums<"task"> = "title_generation";
  const model = openai("gpt-4o-mini");

  const response = await generateObject({
    model,
    output: "object",
    schema: productGenerativeVisualsSchema,
    messages: [
      {
        role: "system",
        content:
          "You are a food expert. Identify the food item in the image and provide only its name using regular capitalization.",
      },
      {
        role: "user",
        content: [{ type: "image", image: new URL(url) }],
      },
    ],
  });

  const { usage, object } = response;

  after(async () => {
    await insertUsage({
      user,
      task,
      model: model.modelId,
      usage,
    });
  });

  return {
    title: object.title,
    brand: object.brand ?? null,
  };
}

export async function searchProduct(
  user: string,
  title: string,
  lang: string,
  brand: string,
  quantity: string,
): Promise<ProductInsert | null> {
  const searchModel = openai.responses("gpt-4o");
  const searchResponse = await generateText({
    model: searchModel,
    messages: [
      {
        role: "system",
        content:
          'You are a product data assistant. Use the `web_search_preview` tool to find the single best product match for the user query, don\'t forget to add search terms like "nutrition" or "voedingswaarde" based on the language. Extract the product title, brand, serving size (be aware that quantity is the something different from the serving size, the quantity is the amount of product in the package, while the serving size is the amount of product you eat at once, often this is less than the quantity), and full nutritional information. Return this data as plain text. If no suitable match is found, try to find similar products via web search and *approximate* the nutritional values based on those similar products. Clearly state in your text response if the nutritional values are approximated',
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

  const structureModel = openai.responses("gpt-4o");
  const structureResponse = await generateObject({
    model: structureModel,
    output: "object",
    schema: productSchema,
    messages: [
      {
        role: "system",
        content:
          "You are a data processing assistant. Convert the provided text containing product information (title, brand, serving size, nutrition) into a structured JSON object matching the required schema (be aware that quantity is the something different from the serving size, the quantity is the amount of product in the package, while the serving size is the amount of product you eat at once, often this is less than the quantity). Ensure all property names are lowercase. Use 0 for missing optional values.",
      },
      {
        role: "user",
        content: searchResponse.text,
      },
    ],
  });

  const { object } = structureResponse;
  return {
    ...object,

    brand: object.brand ?? null,

    serving_unit: object.serving_unit as Enums<"unit">,
    quantity_unit: object.quantity_unit as Enums<"unit">,

    iron_100g: object.iron_100g ?? null,
    fiber_100g: object.fiber_100g ?? null,
    calcium_100g: object.calcium_100g ?? null,
    potassium_100g: object.potassium_100g ?? null,
    fat_trans_100g: object.fat_trans_100g ?? null,
    cholesterol_100g: object.cholesterol_100g ?? null,
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
  lang: string,
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
    schema: productSearchSchema,
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
  title: string,
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
