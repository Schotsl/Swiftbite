import { z } from "zod";

export const servingSchema = z.object({
  option: z.string().min(1, "Please select a serving size"),
  quantity: z.number().min(1, "Quantity is required"),
});

export const mealSchema = z.object({
  title: z.string().min(1, "Title is required"),
});

export const estimationSchema = z.object({
  title: z.string().optional(),
  content: z.string().optional(),
});

export type MealData = z.infer<typeof mealSchema>;
export type EstimationData = z.infer<typeof estimationSchema>;

export type ServingInput = z.infer<typeof servingSchema>;
export type ServingData = z.infer<typeof servingSchema> & {
  gram: number;
};
