import { z } from "zod";

export const searchSchema = z.object({
  query: z
    .string()
    .min(2, "Please enter at least 2 characters to search")
    .max(100, "Search query is too long"),
});

export type SearchData = z.infer<typeof searchSchema>;
