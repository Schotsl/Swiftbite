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
