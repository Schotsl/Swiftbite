import { ProductV2 } from "@openfoodfacts/openfoodfacts-nodejs";
import { roundNumber } from "@/helper";
import { ProductInsert } from "@/types";

function getTitle(product: ProductV2, lang: string) {
  // Try preferred language-specific names first
  const preferenceKey = `product_name_${lang}`;

  if (product[preferenceKey]) {
    return product[preferenceKey];
  }

  // Fallback to the generic product_name
  if (product.product_name) {
    return product.product_name;
  }

  // Fallback to any product_name_xx key using regex
  const fallbackRegexp = /^product_name_[a-z]{2}$/;

  for (const key in product) {
    const fallbackMatch = fallbackRegexp.test(key);

    if (fallbackMatch && product[key]) {
      return product[key];
    }
  }

  throw new Error(`No product name found for ${product.code}`);
}

export function mapProduct(product: ProductV2, lang: string): ProductInsert {
  const { nutriments } = product;

  // TODO: This will probably fail in a lot of cases
  const serving = roundNumber(+product.serving_quantity);
  const servingUnit =
    product.serving_quantity_unit === "ml" ? "milliliter" : "gram";

  const nutritionFats = roundNumber(nutriments.fat_100g ?? 0);
  const nutritionTrans = roundNumber(nutriments["trans-fat_100g"] ?? 0);
  const nutritionSaturated = roundNumber(nutriments["saturated-fat_100g"] ?? 0);
  const nutritionUnsaturated = roundNumber(
    nutritionFats - nutritionSaturated - nutritionTrans
  );

  return {
    serving,
    serving_unit: servingUnit,

    type: "openfood",
    title: getTitle(product, lang),
    brand: product.brands,
    image: product.image_front_url,

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
    icon_id: null,
  };
}
