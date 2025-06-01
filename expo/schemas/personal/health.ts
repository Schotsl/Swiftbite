import { z } from "zod";

export const weightSchema = z.object({
  date: z.date({
    required_error: "Voer een datum in",
    invalid_type_error: "Voer een datum in",
  }),
  weight: z.coerce.number({
    required_error: "Voer een gewicht in",
    invalid_type_error: "Voer een gewicht in",
  }),
});

export const healthSchema = z.object({
  length: z.coerce.number({
    required_error: "Voer een lengte in",
    invalid_type_error: "Voer een lengte in",
  }),
  weight: z.array(weightSchema),
});

export type Weight = z.infer<typeof weightSchema>;
export type HealthData = z.infer<typeof healthSchema>;
