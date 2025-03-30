import { NextResponse } from "next/server";
import { roundNumber } from "@/helper";

// Revalidate once every 30 days
export const revalidate = 2592000;

export async function GET(
  request: Request,
  { params }: { params: Promise<{ code: string }> },
) {
  const { code } = await params;

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
    nutritionFats - nutritionSaturated - nutritionTrans,
  );

  const nutrition = {
    type: "openfood",
    title: product.product_name,
    brand: product.brands,
    image: product.image_front_url,
    portion: nutritionPortion,

    icon_id: null,
    openfood_id: product.code,

    iron_100g: roundNumber(nutriments.iron_100g ?? 0, 2),
    fiber_100g: roundNumber(nutriments.fiber_100g ?? 0, 2),
    sodium_100g: roundNumber(nutriments.sodium_100g ?? 0, 2),
    protein_100g: roundNumber(nutriments.proteins_100g ?? 0, 2),
    calcium_100g: roundNumber(nutriments.calcium_100g ?? 0, 2),
    calorie_100g: roundNumber(nutriments["energy-kcal_100g"] ?? 0, 2),
    potassium_100g: roundNumber(nutriments.potassium_100g ?? 0, 2),
    cholesterol_100g: roundNumber(nutriments.cholesterol_100g ?? 0, 2),
    carbohydrate_100g: roundNumber(nutriments.carbohydrates_100g ?? 0, 2),
    carbohydrate_sugar_100g: roundNumber(nutriments.sugars_100g ?? 0, 2),
    fat_100g: nutritionFats,
    fat_trans_100g: nutritionTrans,
    fat_saturated_100g: nutritionSaturated,
    fat_unsaturated_100g: nutritionUnsaturated,
    micros_100g: {},
  };

  return NextResponse.json(nutrition);
}
