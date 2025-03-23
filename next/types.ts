export type Nutrition = {
  calcium_100g?: number;
  calorie_100g: number;
  carbohydrate_100g: number;
  carbohydrate_sugar_100g?: number;
  cholesterol_100g?: number;
  fat_100g: number;
  fat_saturated_100g?: number;
  fat_trans_100g?: number;
  fat_unsaturated_100g?: number;
  fiber_100g?: number;
  iron_100g?: number;
  micros_100g?: Record<string, unknown>;
  portion: number;
  potassium_100g?: number;
  protein_100g: number;
  sodium_100g: number;
};

// TODO: Removed unused types
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
