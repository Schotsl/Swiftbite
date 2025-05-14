import { Tables } from "./database.types";

export type Option = {
  title: string;
  value: string;
  gram: number;
};

export type ServingData = {
  gram: number;
  option: string;
  quantity: number;
};

export type ProductSearch = {
  title: string;
  brand: string;
  quantity_original?: number | null;
  quantity_original_unit?: string | null;
};

export type ProductBase = Tables<"product">;

export type Product = Omit<
  ProductBase,
  "search" | "options" | "serving" | "quantity"
> & {
  search: ProductSearch | null;
  options: Option[] | null;
  serving: ServingData | null;
  quantity: ServingData | null;
};

export type ProductInsert = Omit<
  Product,
  "uuid" | "options" | "user_id" | "created_at" | "updated_at"
>;
