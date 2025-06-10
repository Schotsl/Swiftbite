import OpenFoodFacts from "@openfoodfacts/openfoodfacts-nodejs";

import { ProductV2 } from "@openfoodfacts/openfoodfacts-nodejs";
import { generateOptions } from "./generative/generate";
import { normalizeQuantity } from "./generative/normalize";
import { Option, ProductInsert } from "@/types";
import { generateSlug, roundNumber } from "@/helper";

export async function fetchProductFromOpenfood(
  user: string | null,
  barcode: string,
): Promise<(ProductInsert & { options: Option[] }) | null> {
  const client = new OpenFoodFacts(fetch);
  const product = await client.getProduct(barcode);

  if (!product) {
    return null;
  }

  const valid = getValid(product);

  if (!valid) {
    return null;
  }

  const mapped = await mapProduct(user, product);
  return mapped;
}

function getValid(product: ProductV2) {
  const { nutriments } = product;

  if (!nutriments) {
    return false;
  }

  const keys = [
    "fat_100g",
    "trans-fat_100g",
    "saturated-fat_100g",
    "iron_100g",
    "fiber_100g",
    "sodium_100g",
    "proteins_100g",
    "calcium_100g",
    "energy-kcal_100g",
    "potassium_100g",
    "cholesterol_100g",
    "carbohydrates_100g",
    "sugars_100g",
  ];

  for (const key of keys) {
    if (nutriments[key] !== undefined) {
      return true;
    }
  }
}

function getTitle(product: ProductV2) {
  const preferenceKey = `product_name_nl`;

  if (product[preferenceKey]) {
    return product[preferenceKey];
  }

  // Fallback to the generic product_name
  if (product.product_name) {
    return product.product_name;
  }

  // Fallback to any product_name_xx key using regex
  // Gemini created this Regexp to match the product_name_xx keys
  const fallbackRegexp = /^product_name_[a-z]{2}$/;

  for (const key in product) {
    const fallbackMatch = fallbackRegexp.test(key);

    if (fallbackMatch && product[key]) {
      return product[key];
    }
  }

  throw new Error(`No product name found for ${product.code}`);
}

async function mapProduct(
  user: string | null,
  product: ProductV2,
): Promise<ProductInsert & { options: Option[] }> {
  const { nutriments } = product;

  const title = getTitle(product);
  const brand = product.brands;

  const [quantity, serving, options] = await Promise.all([
    normalizeQuantity(user, {
      unit: product.product_quantity_unit,
      numeric: product.product_quantity,
      combined: product.quantity,
    }),

    normalizeQuantity(user, {
      unit: product.serving_quantity_unit,
      numeric: product.serving_quantity,
      combined: product.serving_size,
    }),

    generateOptions(user, {
      title,
      brand,
    }),
  ]);

  const optionsMapped = options.map((option) => ({
    value: generateSlug(option.title),
    title: option.title,
    gram: option.gram,
  }));

  const nutritionFats = roundNumber(nutriments.fat_100g ?? 0);
  const nutritionTrans = roundNumber(nutriments["trans-fat_100g"] ?? 0);
  const nutritionSaturated = roundNumber(nutriments["saturated-fat_100g"] ?? 0);
  const nutritionUnsaturated = roundNumber(
    nutritionFats - nutritionSaturated - nutritionTrans,
  );

  const quantityParsed =
    quantity?.quantity_gram &&
    quantity?.quantity_original &&
    quantity?.quantity_original_unit
      ? {
          gram: quantity.quantity_gram,
          quantity: quantity.quantity_original,
          option: quantity.quantity_original_unit,
        }
      : null;

  const servingParsed =
    serving?.quantity_gram &&
    serving?.quantity_original &&
    serving?.quantity_original_unit
      ? {
          gram: serving.quantity_gram,
          quantity: serving.quantity_original,
          option: serving.quantity_original_unit,
        }
      : null;

  return {
    type: "barcode",
    title,
    brand,
    other: null,
    search: null,
    category: null,
    embedding: null,
    processing: false,

    options: optionsMapped,
    serving: servingParsed,
    quantity: quantityParsed,

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
