import { z } from "zod";

export const servingSchema = z.object({
  option: z.string({ required_error: "Selecteer een portie grootte" }),
  quantity: z.coerce
    .number({ required_error: "Voer een portie aantal in" })
    .gt(0, "Portie aantal moet groter zijn dan 0"),
});

export type ServingInput = z.infer<typeof servingSchema>;
export type ServingData = z.infer<typeof servingSchema> & {
  gram: number;
};

export const mealSchema = z.object({
  title: z.string({ required_error: "Voer een titel in" }),
});

export type MealData = z.infer<typeof mealSchema>;

export const createdSchema = z.object({
  created_at: z.date({ required_error: "Voer een datum in" }),
});

export const estimationSchema = z.object({
  title: z.string({ required_error: "Voer een titel in" }).optional(),
  content: z.string({ required_error: "Voer een beschrijving in" }).optional(),
});

export type EstimationData = z.infer<typeof estimationSchema>;

export const productPageSchema = servingSchema.merge(createdSchema);
export type ProductPageData = z.infer<typeof productPageSchema>;

export const mealPageSchema = servingSchema.merge(createdSchema);
export type MealPageData = z.infer<typeof mealPageSchema>;
