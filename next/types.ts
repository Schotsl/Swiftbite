export type IngredientSearch = {
  title: string;
  brand: string;
  quantity: number;
  openfood_id: string;
};

export type Nutrition = {
  calcium_100g?: number;
  calorie_100g: number;
  carbohydrate_100g: number;
  carbohydrate_sugar_100g?: number;
  cholesterol_100g?: number;
  fat_100g: number;
  fat_saturated_100g?: number;
  fat_trans_100g?: number;
  fat_unsaturated_100g?: number;
  fiber_100g?: number;
  iron_100g?: number;
  micros_100g?: Record<string, unknown>;
  portion: number;
  potassium_100g?: number;
  protein_100g: number;
  sodium_100g: number;
};

export type OpenFoodNutriments = {
  fat_100g: number;
  salt_100g: number;
  fiber_100g: number;
  sugars_100g: number;
  sodium_100g: number;
  calcium_100g: number;
  proteins_100g: number;
  carbohydrates_100g: number;
  "trans-fat_100g": number;
  "energy-kcal_100g": number;
  "saturated-fat_100g": number;
};

export type OpenFoodSearch = {
  code: string;
  brands: string;
  product_name: string;
  quantity: string;
  nutriments: OpenFoodNutriments;
  categories_tags: string[];
};
