import { ProductV2 } from "@openfoodfacts/openfoodfacts-nodejs";
import { roundNumber } from "@/helper";
import { ProductInsert } from "@/types";

// TODO: Fix this maybe using AI since it always assumes g
export function getQuantity(product: ProductV2) {
  const quantity = product.quantity;

  if (!quantity) {
    return {
      quantity_gram: null,
      quantity_original: null,
      quantity_original_unit: null,
    };
  }

  // Strip all non-numeric characters from quantity
  const quantityUnit = product.quantity_unit.toLowerCase() || "g";
  const quantityNumber = quantity.replace(/[^0-9]/g, "");

  return {
    quantity_gram: quantityNumber,
    quantity_original: quantityNumber,
    quantity_original_unit: quantityUnit,
  };
}

export function getServing(product: ProductV2) {
  const serving = product.serving_quantity;

  if (!serving) {
    return {
      serving_gram: null,
      serving_original: null,
      serving_original_unit: null,
    };
  }

  const servingUnit = product.serving_quantity_unit;
  const servingNumber = serving.replace(/[^0-9]/g, "");

  return {
    serving_gram: servingNumber,
    serving_original: servingNumber,
    serving_original_unit: servingUnit,
  };
}

export function getTitle(product: ProductV2, lang: string) {
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

  const quantity = getQuantity(product);
  const serving = getServing(product);

  const nutritionFats = roundNumber(nutriments.fat_100g ?? 0);
  const nutritionTrans = roundNumber(nutriments["trans-fat_100g"] ?? 0);
  const nutritionSaturated = roundNumber(nutriments["saturated-fat_100g"] ?? 0);
  const nutritionUnsaturated = roundNumber(
    nutritionFats - nutritionSaturated - nutritionTrans,
  );

  return {
    ...quantity,
    ...serving,

    title: getTitle(product, lang),
    brand: product.brands,
    image: product.image_front_url,
    barcode: product.code,
    estimated: false,

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

    icon_id: null,
  };
}
