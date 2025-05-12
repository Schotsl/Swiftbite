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
  options: Option[];
  serving: ServingData | null;
  quantity: ServingData | null;
};

export type ProductInsert = Omit<
  Product,
  "uuid" | "options" | "user_id" | "created_at" | "updated_at"
>;
