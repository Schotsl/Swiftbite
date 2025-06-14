import { z } from "zod";

export const step8Schema = z.object({
  email: z
    .string({
      required_error: "Voer een e-mailadres in",
      invalid_type_error: "Voer een e-mailadres in",
    })
    .email({ message: "Voer een geldig e-mailadres in" }),

  password: z.string({
    required_error: "Voer een wachtwoord in",
    invalid_type_error: "Voer een wachtwoord in",
  }),

  password_repeat: z.string({
    required_error: "Voer een wachtwoord in",
    invalid_type_error: "Voer een wachtwoord in",
  }),
});

export type Step8Data = z.infer<typeof step8Schema>;
