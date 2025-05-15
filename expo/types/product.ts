import { Tables } from "@/database.types";
import { ServingData } from "@/schemas/serving";

type SearchProduct = {
  title: string;
  brand: string;
  quantity_original?: number | null;
  quantity_original_unit?: string | null;
};

type SearchGeneric = {
  title: string;
  category: string;
};

type Nutritional = {
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

type NutritionalProcessing = {
  calorie_100g: null;
  protein_100g: null;
  carbohydrate_100g: null;
  fat_100g: null;
  fat_trans_100g: null;
  fat_saturated_100g: null;
  fat_unsaturated_100g: null;
  iron_100g: null;
  fiber_100g: null;
  sodium_100g: null;
  calcium_100g: null;
  potassium_100g: null;
  cholesterol_100g: null;
};

type ProductTable = Tables<"product">;
type ProductBase = Omit<ProductTable, "search" | "serving" | "quantity">;

type ProductSearchGenericProcessing = ProductBase &
  NutritionalProcessing & {
    type: "search_generic";
    brand: never;
    title: null;
    search: SearchGeneric;
    barcode: never;
    serving: never;
    quantity: never;
    category: null;
    processing: true;
  };

type ProductSearchGeneric = ProductBase &
  Nutritional & {
    type: "search_generic";
    brand: never;
    title: string;
    search: SearchGeneric;
    barcode: never;
    serving: never;
    quantity: never;
    category: string;
    processing: false;
  };

type ProductSearchProductProcessing = ProductBase &
  NutritionalProcessing & {
    type: "search_product";
    brand: null;
    title: null;
    search: SearchProduct;
    barcode: null;
    serving: null;
    quantity: null;
    category: never;
    processing: true;
  };

type ProductSearchProduct = ProductBase &
  Nutritional & {
    type: "search_product";
    brand: string;
    title: string;
    search: SearchProduct;
    barcode: string | null;
    serving: ServingData | null;
    quantity: ServingData | null;
    category: never;
    processing: false;
  };

type ProductGenerativeProcessing = ProductBase &
  NutritionalProcessing & {
    type: "generative";
    brand: null;
    title: string | null;
    search: never;
    barcode: never;
    serving: never;
    quantity: null;
    category: never;
    processing: true;
  };

type ProductGenerative = ProductBase &
  Nutritional & {
    type: "generative";
    brand: string | null;
    title: string;
    search: never;
    barcode: never;
    serving: never;
    quantity: never;
    category: never;
    processing: false;
  };

type ProductManual = ProductBase &
  Nutritional & {
    type: "manual";
    brand: never;
    title: string;
    search: never;
    barcode: never;
    serving: never;
    quantity: never;
    category: never;
    processing: false;
  };

type ProductBarcode = ProductBase &
  Nutritional & {
    type: "barcode";
    brand: string | null;
    title: string;
    search: never;
    barcode: never;
    serving: ServingData | null;
    quantity: ServingData | null;
    category: never;
    processing: false;
  };

export type Product =
  | ProductSearchGenericProcessing
  | ProductSearchGeneric
  | ProductSearchProductProcessing
  | ProductSearchProduct
  | ProductGenerativeProcessing
  | ProductGenerative
  | ProductBarcode
  | ProductManual;

export type ProductInsert = Omit<
  ProductTable,
  "uuid" | "user_id" | "created_at" | "updated_at"
>;
