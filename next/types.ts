import { Tables } from "./database.types";

export type Product = Tables<"product">;

export type ProductSearch = {
  title: string;
  brand: string;
  quantity: number;
  openfood_id: string;
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

export type OpenFoodNutriments = {
  fat_100g: number;
  salt_100g: number;
  fiber_100g: number;
  sugars_100g: number;
  sodium_100g: number;
  calcium_100g: number;
  proteins_100g: number;
  carbohydrates_100g: number;
  "trans-fat_100g": number;
  "energy-kcal_100g": number;
  "saturated-fat_100g": number;
};

export type OpenFoodSearch = {
  code: string;
  brands: string;
  product_name: string;
  quantity: string;
  nutriments: OpenFoodNutriments;
  categories_tags: string[];
};
