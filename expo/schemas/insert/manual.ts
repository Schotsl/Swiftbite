import { z } from "zod";

export const manualSchema = z.object({
  title: z
    .string({
      required_error: "Voer een titel in",
      invalid_type_error: "Voer een titel in",
    })
    .min(3, "Titel moet minimaal 3 tekens lang zijn")
    .max(100, "Titel moet maximaal 100 tekens lang zijn"),

  calorie_100g: z.coerce
    .number({
      required_error: "Voer calorieën in",
      invalid_type_error: "Voer calorieën in",
    })
    .min(0, "Voer minimaal 0 calorieën in")
    .max(10000, "Voer maximaal 10000 calorieën in"),

  protein_100g: z.coerce
    .number({
      required_error: "Voer eiwitten in",
      invalid_type_error: "Voer eiwitten in",
    })
    .min(0, "Voer minimaal 0 eiwitten in")
    .max(10000, "Voer maximaal 10000 eiwitten in"),

  carbohydrate_100g: z.coerce
    .number({
      required_error: "Voer koolhydraten in",
      invalid_type_error: "Voer koolhydraten in",
    })
    .min(0, "Voer minimaal 0 koolhydraten in")
    .max(10000, "Voer maximaal 10000 koolhydraten in"),

  fat_100g: z.coerce
    .number({
      required_error: "Voer vetten in",
      invalid_type_error: "Voer vetten in",
    })
    .min(0, "Voer minimaal 0 vetten in")
    .max(10000, "Voer maximaal 10000 vetten in"),

  fat_saturated_100g: z.coerce
    .number({
      required_error: "Voer verzadigde vetten in",
      invalid_type_error: "Voer verzadigde vetten in",
    })
    .min(0, "Voer minimaal 0 verzadigde vetten in")
    .max(10000, "Voer maximaal 10000 verzadigde vetten in"),

  fat_unsaturated_100g: z.coerce
    .number({
      required_error: "Voer onverzadigde vetten in",
      invalid_type_error: "Voer onverzadigde vetten in",
    })
    .min(0, "Voer minimaal 0 onverzadigde vetten in")
    .max(10000, "Voer maximaal 10000 onverzadigde vetten in"),

  fat_trans_100g: z.coerce
    .number({
      required_error: "Voer transvetten in",
      invalid_type_error: "Voer transvetten in",
    })
    .min(0, "Voer minimaal 0 transvetten in")
    .max(10000, "Voer maximaal 10000 transvetten in"),

  carbohydrate_sugar_100g: z.coerce
    .number({
      required_error: "Voer suikers in",
      invalid_type_error: "Voer suikers in",
    })
    .min(0, "Voer minimaal 0 suikers in")
    .max(10000, "Voer maximaal 10000 suikers in"),

  fiber_100g: z.coerce
    .number({
      required_error: "Voer vezels in",
      invalid_type_error: "Voer vezels in",
    })
    .min(0, "Voer minimaal 0 vezels in")
    .max(10000, "Voer maximaal 10000 vezels in"),

  sodium_100g: z.coerce
    .number({
      required_error: "Voer natrium in",
      invalid_type_error: "Voer natrium in",
    })
    .min(0, "Voer minimaal 0 natrium in")
    .max(10000, "Voer maximaal 10000 natrium in"),

  iron_100g: z.coerce
    .number({
      required_error: "Voer ijzer in",
      invalid_type_error: "Voer ijzer in",
    })
    .min(0, "Voer minimaal 0 ijzer in")
    .max(10000, "Voer maximaal 10000 ijzer in"),

  potassium_100g: z.coerce
    .number({
      required_error: "Voer kalium in",
      invalid_type_error: "Voer kalium in",
    })
    .min(0, "Voer minimaal 0 kalium in")
    .max(10000, "Voer maximaal 10000 kalium in"),

  calcium_100g: z.coerce
    .number({
      required_error: "Voer calcium in",
      invalid_type_error: "Voer calcium in",
    })
    .min(0, "Voer minimaal 0 calcium in")
    .max(10000, "Voer maximaal 10000 calcium in"),

  cholesterol_100g: z.coerce
    .number({
      required_error: "Voer cholesterol in",
      invalid_type_error: "Voer cholesterol in",
    })
    .min(0, "Voer minimaal 0 cholesterol in")
    .max(10000, "Voer maximaal 10000 cholesterol in"),

  created_at: z.date({ required_error: "Voer een datum in" }),
});

export type ManualData = z.infer<typeof manualSchema>;
