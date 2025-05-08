import { Tables } from "./database.types";
import { MacroData } from "./schemas/personal/goal";
import { Weight } from "./schemas/personal/health";
import { ServingData } from "./schemas/serving";
export type Product = Tables<"product">;

export type ProductManual = Product & {
  type: "manual";
  title: string;
  calorie_100g: number;
  protein_100g: number;
  carbohydrate_100g: number;
  carbohydrate_sugar_100g: number;
  fat_100g: number;
  fat_trans_100g: number;
  fat_saturated_100g: number;
  fat_unsaturated_100g: number;
  iron_100g: number;
  fiber_100g: number;
  sodium_100g: number;
  calcium_100g: number;
  potassium_100g: number;
  cholesterol_100g: number;
};

export type ProductSearch = {
  title: string;
  brand: string;
  quantity_original: number;
  quantity_original_unit: string;
};

export type Repeat = Tables<"repeat">;
export type RepeatWithProductOrMeal = Omit<Repeat, "serving" | "time"> & {
  time: Date;
  serving: ServingData;

  meal?: Meal;
  product?: Product;
};

export type RepeatInsert = Omit<
  Repeat,
  "uuid" | "user_id" | "created_at" | "updated_at" | "time"
> & {
  time: Date;
};

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

export type ProductInsert = Omit<
  Product,
  "uuid" | "user_id" | "created_at" | "updated_at"
>;

export type Generative = Tables<"generative">;

export type UserBase = Tables<"user">;
export type UserSetup = UserBase;
export type User = Omit<UserBase, "birth" | "weight" | "macro"> & {
  birth: Date;
  macro: MacroData;
  weight: Weight[];
  length: number;
  language: string;
  calories: number;
  last_name: string;
  first_name: string;
};

export type Entry = Tables<"entry">;
export type EntryWithProduct = Entry & {
  product: Product;
  // Meal has to be removed
  meal?: MealWithProduct;
};

export type EntryWithProductManual = Entry & {
  product: ProductManual;
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
