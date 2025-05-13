import { Tables } from "./database.types";

export type Option = {
  title: string;
  value: string;
  gram: number;
};

export type ServingData = {
  quantity: number;
  option: string;
  gram: number;
};

export type ProductBase = Tables<"product">;
export type Product = Omit<ProductBase, "options" | "serving" | "quantity"> & {
  search: ProductSearchBase | null;
  options: Option[] | null;
  serving: ServingData | null;
  quantity: ServingData | null;
};

export type ProductSearchBase = {
  title: string;
  brand: string;
  quantity_original: number;
  quantity_original_unit: string;
};

export type ProductSearch = ProductSearchBase & {
  new: boolean;
  uuid: string;
};

export type ProductInsert = Omit<
  Product,
  "uuid" | "options" | "user_id" | "created_at" | "updated_at"
>;
