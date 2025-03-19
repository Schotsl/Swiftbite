import { NextResponse } from "next/server";
import { Nutrition } from "@/types";
import { roundNumber } from "@/helper";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.json({ error: "Code is required" }, { status: 400 });
  }

  const url = `https://world.openfoodfacts.org/api/v3/product/${code}.json`;
  const response = await fetch(url);

  const data = await response.json();

  if (!data.product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  const product = data.product;
  const nutriments = product.nutriments;

  const nutritionPortion = roundNumber(+nutriments.fat_100g);

  const nutritionFats = roundNumber(nutriments.fat_100g ?? 0);
  const nutritionTrans = roundNumber(nutriments["trans-fat_100g"] ?? 0);
  const nutritionSaturated = roundNumber(nutriments["saturated-fat_100g"] ?? 0);
  const nutritionUnsaturated = roundNumber(
    nutritionFats - nutritionSaturated - nutritionTrans
  );

  // Map OpenFoodFacts data to your nutrition type
  const nutrition: Nutrition = {
    portion: nutritionPortion,
    protein_100g: roundNumber(nutriments.proteins_100g ?? 0, 2),
    calcium_100g: roundNumber(nutriments.calcium_100g ?? 0, 2),
    calorie_100g: roundNumber(nutriments["energy-kcal_100g"] ?? 0, 2),
    carbohydrate_100g: roundNumber(nutriments.carbohydrates_100g ?? 0, 2),
    carbohydrate_sugar_100g: roundNumber(nutriments.sugars_100g ?? 0, 2),
    cholesterol_100g: roundNumber(nutriments.cholesterol_100g ?? 0, 2),
    fat_100g: nutritionFats,
    fat_trans_100g: nutritionTrans,
    fat_saturated_100g: nutritionSaturated,
    fat_unsaturated_100g: nutritionUnsaturated,
    fiber_100g: roundNumber(nutriments.fiber_100g ?? 0, 2),
    iron_100g: roundNumber(nutriments.iron_100g ?? 0, 2),
    micros_100g: {},
    sodium_100g: roundNumber(nutriments.sodium_100g ?? 0, 2),
  };

  return NextResponse.json(nutrition);
}
