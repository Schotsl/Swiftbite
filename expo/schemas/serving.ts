import { z } from "zod";

export const servingSchema = z.object({
  option: z.string().min(1, "Please select a serving size"),
  quantity: z.coerce.number().min(1, "Quantity is required"),
});

export type ServingInput = z.infer<typeof servingSchema>;
export type ServingData = z.infer<typeof servingSchema> & {
  gram: number;
};

export const mealSchema = z.object({
  title: z.string().min(1, "Title is required"),
});

export type MealData = z.infer<typeof mealSchema>;

export const createdSchema = z.object({
  created_at: z.date({ required_error: "Voer een tijd in" }),
});

export const estimationSchema = z.object({
  title: z.string().optional(),
  content: z.string().optional(),
});

export type EstimationData = z.infer<typeof estimationSchema>;

export const productPageSchema = servingSchema.merge(createdSchema);
export type ProductPageData = z.infer<typeof productPageSchema>;

export const mealPageSchema = servingSchema.merge(createdSchema);
export type MealPageData = z.infer<typeof mealPageSchema>;
