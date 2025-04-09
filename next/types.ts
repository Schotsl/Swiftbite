import { Tables } from "./database.types";

export type Product = Tables<"product">;
export type ProductSearch = {
  title: string;
  brand: string;
  quantity: number;
};

export type ProductInsert = Omit<
  Product,
  "uuid" | "user_id" | "created_at" | "updated_at"
>;

export type ProductGenerativeVisuals = { title: string; brand: string | null };
export type ProductGenerativeNutrition = Omit<
  ProductInsert,
  | "type"
  | "image"
  | "title"
  | "brand"
  | "icon_id"
  | "micros_100g"
  | "openfood_id"
>;
