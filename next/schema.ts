import { z } from "zod";

const otherSchema = z
  .array(
    z.object({
      name: z.string().describe("The name of the nutritional value"),
      quantity: z.number().describe("The quantity of the nutritional value"),
    }),
  )
  .describe(
    `Any other nutritional values of note that are discovered, for example Vitamin A, Vitamin B12, alcohol, etc.`,
  )
  .optional()
  .nullable();

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

  other: otherSchema,
});

export type NutritionSchema = z.infer<typeof nutritionSchema>;

export const productGenerativeVisualsSchema = z.object({
  title: z.string().describe("Product title"),
  brand: z.string().describe("Product brand, if available").nullable(),
});

export type ProductGenerativeVisualsData = z.infer<
  typeof productGenerativeVisualsSchema
>;

export const productGenerativeNutritionSchema = nutritionSchema.extend({
  serving_original: z
    .number()
    .describe("Numeric value of the recommended serving size, for example 100"),
  serving_original_unit: z
    .string()
    .describe(`Unit of the recommended serving size, for example g, ml, etc.`),
  serving_gram: z
    .number()
    .describe(
      `Numeric value of the recommended serving size converted to grams`,
    ),

  quantity_original: z
    .number()
    .describe(
      "Numeric value of the total quantity in the product's packaging, for example 100",
    )
    .optional()
    .nullable(),
  quantity_original_unit: z
    .string()
    .describe(
      `Unit of the total quantity in the product's packaging, for example g, ml, etc.`,
    )
    .optional()
    .nullable(),
  quantity_gram: z
    .number()
    .describe(
      `Numeric value of the total quantity in the product's packaging converted to grams`,
    )
    .optional()
    .nullable(),
});

export type ProductGenerativeNutritionData = z.infer<
  typeof productGenerativeNutritionSchema
>;

export const productSchema = nutritionSchema.extend({
  title: z.string().describe("Product title"),
  brand: z.string().describe("Product brand if available").nullable(),
  barcode: z.string().describe("Product barcode if available").nullable(),
  estimated: z
    .boolean()
    .describe(
      `True if nutritional values are estimated due to not being able to find the product`,
    ),

  serving_original: z
    .number()
    .describe("Numeric value of the recommended serving size")
    .optional()
    .nullable(),
  serving_original_unit: z
    .string()
    .describe(`Unit of the recommended serving size`)
    .optional()
    .nullable(),
  serving_gram: z
    .number()
    .describe(
      `Numeric value of the recommended serving size converted to grams`,
    )
    .optional()
    .nullable(),

  quantity_original: z
    .number()
    .describe("Numeric value of the total quantity in the product's packaging")
    .optional()
    .nullable(),
  quantity_original_unit: z
    .string()
    .describe(`Unit of the total quantity in the product's packaging`)
    .optional()
    .nullable(),
  quantity_gram: z
    .number()
    .describe(
      `Numeric value of the total quantity in the product's packaging converted to grams`,
    )
    .optional()
    .nullable(),
});

export type ProductData = z.infer<typeof productSchema>;

export const productSearchSchema = z.object({
  title: z
    .string()
    .describe("Product title, this shouldn't include the quantity or unit"),
  brand: z.string().describe("Product brand"),
  quantity_original: z
    .number()
    .describe("Quantity of the product in the packaging")
    .optional()
    .nullable(),
  quantity_original_unit: z
    .string()
    .describe(
      `Unit for the quantity of the product in the packaging (e.g., g, ml)`,
    )
    .optional()
    .nullable(),
});

export type ProductSearchData = z.infer<typeof productSearchSchema>;

export const genericSchema = nutritionSchema.extend({
  title: z.string().describe("Product title"),
  category: z.string().describe("Product category"),
  estimated: z
    .boolean()
    .describe(
      `True if nutritional values are estimated due to not being able to find the product`,
    ),
});

export type GenericData = z.infer<typeof genericSchema>;

export const genericSearchSchema = z.object({
  title: z.string().describe("The title of the generic item"),
  category: z.string().describe("The category of the generic item"),
});

export type GenericSearchData = z.infer<typeof genericSearchSchema>;

export const quantitySchema = z.object({
  quantity_gram: z.number().describe("Quantity converted to grams").nullable(),
  quantity_original: z
    .number()
    .describe("Quantity in original unit")
    .nullable(),
  quantity_original_unit: z
    .string()
    .describe("Unit of quantity in original unit")
    .nullable(),
});

export type QuantityData = z.infer<typeof quantitySchema>;

export const optionSchema = z.object({
  title: z
    .string()
    .describe("The title of the option, for example 'Small slice'"),
  gram: z
    .number()
    .describe(
      "An estimate of the amount of grams in the option, for example 100",
    ),
});

export type OptionData = z.infer<typeof optionSchema>;

export const titleSchema = z.object({
  title: z.string().describe("Normalized meal title"),
});

export type TitleData = z.infer<typeof titleSchema>;
