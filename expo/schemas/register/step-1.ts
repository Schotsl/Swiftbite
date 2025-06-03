import { z } from "zod";

export const step1Schema = z.object({
  first_name: z
    .string({
      required_error: "Voer een voornaam in",
      invalid_type_error: "Voer een voornaam in",
    })
    .min(3, "Voornaam moet minimaal 3 karakters lang zijn")
    .max(100, "Voornaam moet maximaal 100 karakters lang zijn"),

  last_name: z
    .string({
      required_error: "Voer een achternaam in",
      invalid_type_error: "Voer een achternaam in",
    })
    .min(3, "Achternaam moet minimaal 3 karakters lang zijn")
    .max(100, "Achternaam moet maximaal 100 karakters lang zijn"),
});

export type Step1Data = z.infer<typeof step1Schema>;
