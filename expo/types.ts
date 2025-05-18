import { Tables } from "./database.types";
import { MacroData } from "./schemas/personal/goal";
import { Weight } from "./schemas/personal/health";
import { ServingData } from "./schemas/serving";
import { Product } from "./types/product";

export type MacroAbsolute = {
  fat: number;
  carbs: number;
  protein: number;
  calories: number;
};

export type Option = {
  value: string;
  title: string;
};

export type OptionWithGram = Option & {
  gram: number;
};

export type Image = {
  uri: string;
  width: number;
  height: number;
};

export enum CameraSelected {
  Label = "Label",
  Barcode = "Barcode",
  Estimation = "Estimation",
}

export type Generative = Tables<"generative">;

export type EntryBase = Tables<"entry">;
export type Entry = Omit<EntryBase, "serving"> & {
  serving: ServingData | null;
};

export type EntryWithProduct = Entry & {
  meal: never;
  product: Product;
};

export type EntryWithMeal = Entry & {
  meal: MealWithProduct;
  product: never;
};

export type Meal = Tables<"meal">;
export type MealProductBase = Tables<"meal_product">;
export type MealProduct = Omit<MealProductBase, "product_id"> & {
  serving: ServingData;
  product: Product;
};

export type MealProductWithProduct = MealProduct & { product: Product };
export type MealWithProduct = Meal & {
  quantity_gram: number;
  meal_products: MealProductWithProduct[] | null;
};

export type MealInsert = Omit<
  Meal,
  "uuid" | "user_id" | "created_at" | "updated_at" | "icon_id"
> &
  Partial<
    Pick<Meal, "uuid" | "user_id" | "created_at" | "updated_at" | "icon_id">
  >;

export type MealProductInsert = Omit<
  MealProduct,
  "user_id" | "created_at" | "updated_at"
> &
  Partial<Pick<MealProduct, "user_id" | "created_at" | "updated_at">>;

export type MealProductWithProductInsert = Omit<
  MealProductInsert & {
    product: Product;
  },
  "user_id" | "created_at" | "updated_at"
> &
  Partial<Pick<MealProduct, "user_id" | "created_at" | "updated_at">>;

export type MealWithProductInsert = Omit<
  MealInsert & {
    meal_products: MealProductWithProductInsert[] | null;
  },
  "uuid" | "user_id" | "created_at" | "updated_at" | "icon_id"
> &
  Partial<
    Pick<Meal, "uuid" | "user_id" | "created_at" | "updated_at" | "icon_id">
  >;

export type GenerativeInsert = Omit<
  Generative,
  "uuid" | "user_id" | "created_at" | "updated_at"
>;

export type EntryInsert = Omit<
  Entry,
  "uuid" | "user_id" | "created_at" | "updated_at"
>;

export enum HealthStatus {
  Ready = "ready",
  Error = "error",
  Loading = "loading",
  Refreshing = "refreshing",
}
