import { z } from "zod";

const nutritionSchema = z.object({
  fat_100g: z.number().describe("Total fat per 100g in grams"),
  calorie_100g: z.number().describe("Calories per 100g"),
  protein_100g: z.number().describe("Protein per 100g in grams"),
  sodium_100g: z.number().describe("Sodium per 100g in milligrams"),
  carbohydrate_100g: z.number().describe("Carbohydrates per 100g in grams"),
  calcium_100g: z.number().describe("Calcium per 100g in milligrams"),
  carbohydrate_sugar_100g: z
    .number()
    .describe("Sugar content per 100g in grams"),
  cholesterol_100g: z.number().describe("Cholesterol per 100g in milligrams"),
  fat_saturated_100g: z.number().describe("Saturated fat per 100g in grams"),
  fat_trans_100g: z.number().describe("Trans fat per 100g in grams"),
  fat_unsaturated_100g: z
    .number()
    .describe("Unsaturated fat per 100g in grams"),
  fiber_100g: z.number().describe("Fiber per 100g in grams"),
  iron_100g: z.number().describe("Iron per 100g in milligrams"),
  potassium_100g: z.number().describe("Potassium per 100g in milligrams"),
});

export const productSchema = nutritionSchema.extend({
  title: z.string().describe("Product title"),
  brand: z.string().describe("Product brand if available").optional(),
  estimated: z.boolean().describe("True if nutritional values are estimated"),

  serving: z
    .number()
    .describe("Recommended serving size printed on the packaging"),
  serving_unit: z
    .string()
    .describe(
      `Unit for the recommended serving printed on the packaging (e.g., gram, milliliter)`,
    ),

  quantity: z.number().describe("Quantity of the product in the packaging"),
  quantity_unit: z
    .string()
    .describe(
      `Unit for the quantity of the product in the packaging (e.g., gram, milliliter)`,
    ),
});

export const productGenerativeNutritionSchema = productSchema.extend({
  serving: z
    .number()
    .describe("Recommended serving size printed on the packaging"),
  serving_unit: z
    .string()
    .describe(
      `Unit for the recommended serving printed on the packaging (e.g., gram, milliliter)`,
    ),

  quantity: z.number().describe("Quantity of the product in the packaging"),
  quantity_unit: z
    .string()
    .describe(
      `Unit for the quantity of the product in the packaging (e.g., gram, milliliter)`,
    ),
});

export const productGenerativeVisualsSchema = z.object({
  title: z.string().describe("Product title"),
  brand: z.string().describe("Product brand, if available").optional(),
});

export const productSearchSchema = z.object({
  title: z.string().describe("Product title"),
  brand: z.string().describe("Product brand"),
  quantity: z.number().describe("Quantity of the product in the packaging"),
  quantity_unit: z
    .string()
    .describe(
      `Unit for the quantity of the product in the packaging (e.g., gram, milliliter)`,
    ),
});
