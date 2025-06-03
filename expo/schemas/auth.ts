import { z } from "zod";

export const signInSchema = z.object({
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
});

export const passwordForgottenSchema = z.object({
  email: z.string({
    required_error: "Voer een e-mailadres in",
    invalid_type_error: "Voer een e-mailadres in",
  }),
});

export type SignInData = z.infer<typeof signInSchema>;
export type PasswordForgottenData = z.infer<typeof passwordForgottenSchema>;
