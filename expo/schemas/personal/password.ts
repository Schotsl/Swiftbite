import { z } from "zod";

export const passwordSchema = z
  .object({
    password: z.string({ required_error: "Voer een wachtwoord in" }),

    password_new: z
      .string({ required_error: "Voer een wachtwoord in" })
      .min(8, { message: "Wachtwoord moet minimaal 8 tekens lang zijn" })
      .regex(/^(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).+$/, {
        message:
          "Wachtwoord moet minimaal één hoofdletter, één cijfer en één speciaal teken bevatten",
      }),

    password_new_confirm: z.string({
      required_error: "Voer een wachtwoord in",
    }),
  })
  .refine((data) => data.password_new === data.password_new_confirm, {
    path: ["password_new_confirm"],
    message: "Nieuwe wachtwoorden komen niet overeen",
  });

export type PasswordData = z.infer<typeof passwordSchema>;
