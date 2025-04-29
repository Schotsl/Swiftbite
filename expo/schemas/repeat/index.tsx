import { z } from "zod";

export const repeatSchema = z.object({
  weekdays: z
    .array(
      z.string({
        required_error: "Voer een dag in",
      })
    )
    .min(1, "Voer minimaal een dag in")
    .max(7, "Voer maximaal 7 dagen in"),

  time: z.date({
    required_error: "Voer een tijdstip in (HH:MM)",
  }),
});

export type RepeatData = z.infer<typeof repeatSchema>;
