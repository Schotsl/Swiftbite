import { Enums, Tables } from "./database.types";

export type Product = Tables<"product">;

export type ProductSearch = {
  title: string;
  brand: string;
  quantity: number;
  quantity_unit: Enums<"unit">;
};

export type ProductInsert = Omit<
  Product,
  "uuid" | "user_id" | "created_at" | "updated_at"
>;

export type Generative = Tables<"generative">;

export type Entry = Tables<"entry">;
export type EntryWithProduct = Entry & {
  product: Product;
};

export type Meal = Tables<"meal">;
export type MealProduct = Tables<"meal_product">;
export type MealProductWithProduct = MealProduct & {
  product: Product;
};

export type MealWithProduct = Meal & {
  meal_product: MealProductWithProduct[];
};

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
