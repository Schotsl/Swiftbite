import { Tables } from "./database.types";
import { GenericSearchData, ProductSearchData } from "./schema";

export type Option = {
  title: string;
  value: string;
  gram: number;
};

export type Serving = {
  gram: number;
  option: string;
  quantity: number;
};

export type ProductBase = Tables<"product">;
export type Product = Omit<
  ProductBase,
  "search" | "options" | "serving" | "quantity"
> & {
  search: ProductSearchData | GenericSearchData | null;
  options: Option[] | null;
  serving: Serving | null;
  quantity: Serving | null;
};

export type ProductInsert = Omit<
  Product,
  "uuid" | "options" | "user_id" | "created_at" | "updated_at"
>;

export type Entry = Tables<"entry">;
export type EntryInsert = Omit<Entry, "uuid" | "created_at" | "updated_at">;

export type Ingredient = Tables<"meal_product"> & {
  serving: Serving;
  product: { title: string };
};
