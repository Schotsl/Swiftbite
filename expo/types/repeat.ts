import { Tables } from "@/database.types";
import { Product } from "./product";
import { ServingData } from "@/schemas/serving";
import { MealWithProduct } from "@/types/meal";

type RepeatTable = Tables<"repeat">;
type RepeatStripped = Omit<RepeatTable, "serving" | "time">;
type RepeatBase = RepeatStripped & {
  time: Date;
  serving: ServingData;
};

type RepeatWithProduct = RepeatBase & {
  meal: never;
  product: Product;
};

type RepeatWithMeal = RepeatBase & {
  meal: MealWithProduct;
  product: never;
};

export type Repeat = RepeatWithProduct | RepeatWithMeal;
export type RepeatInsert = Omit<
  RepeatTable,
  "uuid" | "user_id" | "created_at" | "updated_at"
>;
