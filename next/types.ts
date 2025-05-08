import { Tables } from "./database.types";

export type Option = {
  title: string;
  value: string;
  gram: number;
};

export type Product = Tables<"product">;

export type ProductInsert = Omit<
  Product,
  "uuid" | "options" | "user_id" | "created_at" | "updated_at"
>;
