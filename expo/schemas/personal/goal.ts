import { z } from "zod";

export const calorieSchema = z.object({
  calories: z.coerce
    .number({ required_error: "Voer een caloriebudget in" })
    .min(0, "Voer een caloriebudget van 0 of hoger in")
    .max(10000, "Voer een caloriebudget van 10000 of lager in"),
});

export const macroSchema = z.object({
  fat: z.coerce
    .number({
      required_error: "Voer een vetpercentage in",
      invalid_type_error: "Voer een vetpercentage in",
    })
    .min(0, "Voer een vetpercentage van 0% of hoger in")
    .max(1, "Voer een vetpercentage van 100% of lager in"),

  carbs: z.coerce
    .number({
      required_error: "Voer een koolhydraatpercentage in",
      invalid_type_error: "Voer een koolhydraatpercentage in",
    })
    .min(0, "Voer een koolhydraatpercentage van 0% of hoger in")
    .max(1, "Voer een koolhydraatpercentage van 100% of lager in"),

  protein: z.coerce
    .number({
      required_error: "Voer een eiwitpercentage in",
      invalid_type_error: "Voer een eiwitpercentage in",
    })
    .min(0, "Voer een eiwitpercentage van 0% of hoger in")
    .max(1, "Voer een eiwitpercentage van 100% of lager in"),
});

export const goalSchema = z.object({
  macro: macroSchema,
  calories: calorieSchema.shape.calories,
});

export type GoalData = z.infer<typeof goalSchema>;
export type MacroData = z.infer<typeof macroSchema>;
export type CalorieData = z.infer<typeof calorieSchema>;
