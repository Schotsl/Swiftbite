import { Tables } from "./database.types";

export type Option = {
  title: string;
  value: string;
  gram: number;
};

export type Product = Tables<"product">;
export type ProductSearch = {
  title: string;
  brand: string;
  quantity_original: number;
  quantity_original_unit: string;
};

export type ProductInsert = Omit<
  Product,
  "uuid" | "user_id" | "created_at" | "updated_at"
>;

export type ProductGenerativeVisuals = { title: string; brand: string | null };
export type ProductGenerativeNutrition = Omit<
  ProductInsert,
  "image" | "title" | "brand" | "icon_id" | "barcode"
>;
