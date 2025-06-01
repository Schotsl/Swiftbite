import { z } from "zod";

export const statsSchema = z.object({
  date: z.object({
    end: z.date(),
    start: z.date(),
  }),
});

export type StatsData = z.infer<typeof statsSchema>;
