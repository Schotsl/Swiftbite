export type Estimation = {
  calories: number; // Total estimated calories (kcal)
  protein: number; // Protein content (grams)
  fat: number; // Total fat (grams)
  carbohydrates: number; // Total carbohydrates (grams)
  sugars: number; // Sugar content (grams)
  fiber: number; // Dietary fiber (grams)
  sodium: number; // Sodium content (milligrams)

  saturated_fat?: number; // Saturated fat (grams)
  unsaturated_fat?: number; // Unsaturated fat (grams)
  cholesterol?: number; // Cholesterol (milligrams)
  potassium?: number; // Potassium content (milligrams)
  calcium?: number; // Calcium content (milligrams)
  iron?: number; // Iron content (milligrams)
  weight?: number; // Serving size (grams or milliliters)
};
