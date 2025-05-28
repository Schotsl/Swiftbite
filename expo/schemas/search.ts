import { z } from "zod";

export const searchSchema = z.object({
  query: z.string().optional(),
});

export type SearchData = z.infer<typeof searchSchema>;
