import { z } from "zod";

export const deleteSchema = z.object({
  password: z.string({
    required_error: "Voer een wachtwoord in",
    invalid_type_error: "Voer een wachtwoord in",
  }),
});

export type DeleteData = z.infer<typeof deleteSchema>;
