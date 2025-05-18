import { Tables } from "@/database.types";
import { Product } from "./product";
import { ServingData } from "@/schemas/serving";

type MealTable = Tables<"meal">;

export type Meal = MealTable;
export type MealInsert = Omit<
  MealTable,
  "uuid" | "user_id" | "created_at" | "updated_at" | "icon_id"
>;

export type MealWithProduct = MealTable & {
  quantity_gram: number;
  meal_products: MealProductBase[] | null;
};

export type MealProductTable = Tables<"meal_product">;
export type MealProductBase = MealProductTable & {
  serving: ServingData;
  product: Product;
};

export type MealProduct = MealProductBase;
export type MealProductInsert = Omit<
  MealProductBase,
  "user_id" | "created_at" | "updated_at"
>;
