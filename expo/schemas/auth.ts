import { z } from "zod";

export const authSchema = z.object({
  email: z
    .string({ required_error: "Voer een e-mailadres in" })
    .email({ message: "Voer een geldig e-mailadres in" }),
  password: z.string({
    required_error: "Voer een wachtwoord in",
  }),
});

export type AuthData = z.infer<typeof authSchema>;
