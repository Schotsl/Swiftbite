import { Tables } from "@/database.types";
import { ServingData } from "@/schemas/serving";
import { Product } from "./product";
import { Meal } from "@/types";

export type RepeatTable = Tables<"repeat">;
export type RepeatStripped = Omit<RepeatTable, "serving" | "time">;
export type RepeatBase = RepeatStripped & {
  time: Date;
  serving: ServingData;
};

export type RepeatWithProduct = RepeatBase & {
  meal: never;
  product: Product;
};

export type RepeatWithMeal = RepeatBase & {
  meal: Meal;
  product: never;
};

export type Repeat = RepeatWithProduct | RepeatWithMeal;

export type RepeatInsert = Omit<
  RepeatTable,
  "uuid" | "user_id" | "created_at" | "updated_at"
>;
