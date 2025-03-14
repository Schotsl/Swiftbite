import { Tables } from "./database.types";

export type Ingredient = Tables<"ingredient">;
export type Generative = Tables<"generative">;

export type Entry = Tables<"entry">;
export type EntryWithIngredient = Entry & {
  ingredient: Ingredient;
};

export type IngredientInsert = Omit<
  Ingredient,
  "uuid" | "user_id" | "created_at" | "updated_at"
>;

export type GenerativeInsert = Omit<
  Generative,
  "uuid" | "user_id" | "created_at" | "updated_at"
>;

export type EntryInsert = Omit<
  Entry,
  "uuid" | "user_id" | "created_at" | "updated_at"
>;

export enum HealthStatus {
  Ready = "ready",
  Error = "error",
  Loading = "loading",
  Refreshing = "refreshing",
}
