import { Enums, Tables } from "./database.types";

export type Product = Tables<"product">;

export type ProductSearch = {
  title: string;
  brand: string;
  quantity_original: number;
  quantity_original_unit: Enums<"unit">;
};

export type Option = {
  gram: number;
  value: string;
  title: string;
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

export type ProductInsert = Omit<
  Product,
  "uuid" | "user_id" | "created_at" | "updated_at"
>;

export type Generative = Tables<"generative">;

export type Entry = Tables<"entry">;
export type EntryWithProduct = Entry & {
  product: Product;
};

export type Meal = Tables<"meal">;
export type MealProduct = Tables<"meal_product">;
export type MealProductWithProduct = MealProduct & { product: Product };
export type MealWithProduct = Meal & { meal_product: MealProductWithProduct[] };

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
    product: ProductInsert;
  },
  "user_id" | "created_at" | "updated_at"
> &
  Partial<Pick<MealProduct, "user_id" | "created_at" | "updated_at">>;

export type MealWithProductInsert = Omit<
  MealInsert & {
    meal_product: MealProductWithProductInsert[];
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
