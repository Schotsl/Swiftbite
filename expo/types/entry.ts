import { Tables } from "@/database.types";
import { Product } from "./product";
import { ServingData } from "@/schemas/serving";
import { MealWithProduct } from "@/types/meal";

type EntryTable = Tables<"entry">;
type EntryStripped = Omit<EntryTable, "serving">;
type EntryBase = EntryStripped & {
  serving: ServingData | null;
};

type EntryWithProduct = EntryBase & {
  meal: never;
  product: Product;
};

type EntryWithMeal = EntryBase & {
  meal: MealWithProduct;
  product: never;
};

export type Entry = EntryWithProduct | EntryWithMeal;
export type EntryInsert = Omit<
  EntryTable,
  "uuid" | "user_id" | "created_at" | "updated_at"
>;
