import { Tables } from "@/database.types";
import { Weight } from "@/schemas/personal/health";
import { MacroData } from "@/schemas/personal/goal";

type UserTable = Tables<"user">;
type UserStripped = Omit<UserTable, "birth" | "weight" | "macro">;

export type User = UserStripped & {
  total: number;
  email: string;
  birth: Date;
  macro: MacroData;
  weight: Weight[];
  length: number;
  language: string;
  calories: number;
  last_name: string;
  first_name: string;
  favorite_meals: string[];
  favorite_products: string[];
};
