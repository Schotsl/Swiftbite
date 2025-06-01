import { z } from "zod";

export const preferenceSchema = z.object({
  language: z.string({
    required_error: "Voer een taal in",
    invalid_type_error: "Voer een taal in",
  }),
  measurement: z.enum(["metric", "imperial"], {
    required_error: "Voer een meetsysteem in",
  }),
});

export type PreferenceData = z.infer<typeof preferenceSchema>;
