import { z } from "zod";

export const servingSchema = z.object({
  sizeOption: z.string().min(1, "Please select a serving size"),
  quantity: z
    .string()
    .min(1, "Quantity is required")
    .refine(
      (val) => {
        const number = parseFloat(val);
        const numberPositive = number > 0;

        return numberPositive;
      },
      {
        message: "Quantity must be a positive number",
      }
    ),
});

export const servingSchemaNew = z.object({
  quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
});

export const mealSchema = z.object({
  title: z.string().min(1, "Title is required"),
});

export const estimationSchema = z.object({
  title: z.string().optional(),
  content: z.string().optional(),
});

export type ServingData = z.infer<typeof servingSchema>;
export type ServingDataNew = z.infer<typeof servingSchemaNew>;
export type MealData = z.infer<typeof mealSchema>;
export type EstimationData = z.infer<typeof estimationSchema>;
