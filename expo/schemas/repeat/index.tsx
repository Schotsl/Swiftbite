import { z } from "zod";

export const repeatSchema = z.object({
  weekdays: z
    .array(
      z.string({
        required_error: "Selecteer een dag",
        invalid_type_error: "Selecteer een dag",
      })
    )
    .min(1, "Selecteer minimaal eén dag")
    .max(7, "Selecteer maximaal zeven dagen"),

  time: z.date({
    required_error: "Selecteer een tijdstip",
    invalid_type_error: "Selecteer een tijdstip",
  }),
});

export type RepeatData = z.infer<typeof repeatSchema>;
