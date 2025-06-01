import { z } from "zod";

export const statsSchema = z.object({
  date: z.object({
    end: z.date({ required_error: "Selecteer een einddatum" }),
    start: z.date({ required_error: "Selecteer een startdatum" }),
  }),
});

export type StatsData = z.infer<typeof statsSchema>;
