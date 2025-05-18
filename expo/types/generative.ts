import { Tables } from "@/database.types";

export type GenerativeTable = Tables<"generative">;

export type Generative = GenerativeTable;
export type GenerativeInsert = Omit<
  GenerativeTable,
  "uuid" | "user_id" | "created_at" | "updated_at"
>;
