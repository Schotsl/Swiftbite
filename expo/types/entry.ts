import { Tables } from "@/database.types";
import { Product } from "./product";
import { ServingData } from "@/schemas/serving";
import { MealWithProduct } from "@/types/meal";

type EntryTable = Tables<"entry">;
type EntryStripped = Omit<EntryTable, "serving" | "created_at">;
type EntryBase = EntryStripped & {
  serving: ServingData | null;
  created_at: Date;
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
  EntryBase,
  "uuid" | "user_id" | "updated_at" | "created_at"
> & {
  created_at?: Date;
};
