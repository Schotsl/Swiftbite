import OpenFoodFacts, { ProductV2 } from "@openfoodfacts/openfoodfacts-nodejs";
import { NextRequest, NextResponse } from "next/server";
import { roundNumber } from "@/helper";
import { ProductInsert } from "@/types";

const client = new OpenFoodFacts(fetch);

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

function mapProduct(product: ProductV2, lang: string): ProductInsert {
  // TODO: This will probably fail in a lot of cases
  const serving = roundNumber(+product.serving_quantity);
  const servingUnit =
    product.serving_quantity_unit === "ml" ? "milliliter" : "gram";

  const nutritionFats = roundNumber(product.fat_100g ?? 0);
  const nutritionTrans = roundNumber(product["trans-fat_100g"] ?? 0);
  const nutritionSaturated = roundNumber(product["saturated-fat_100g"] ?? 0);
  const nutritionUnsaturated = roundNumber(
    nutritionFats - nutritionSaturated - nutritionTrans,
  );

  return {
    serving,
    serving_unit: servingUnit,

    type: "openfood",
    title: getTitle(product, lang),
    brand: product.brands,
    image: product.image_front_url,

    openfood_id: product.code,

    iron_100g: roundNumber(product.iron_100g ?? 0, 2),
    fiber_100g: roundNumber(product.fiber_100g ?? 0, 2),
    sodium_100g: roundNumber(product.sodium_100g ?? 0, 2),
    protein_100g: roundNumber(product.proteins_100g ?? 0, 2),
    calcium_100g: roundNumber(product.calcium_100g ?? 0, 2),
    calorie_100g: roundNumber(product["energy-kcal_100g"] ?? 0, 2),
    potassium_100g: roundNumber(product.potassium_100g ?? 0, 2),
    cholesterol_100g: roundNumber(product.cholesterol_100g ?? 0, 2),
    carbohydrate_100g: roundNumber(product.carbohydrates_100g ?? 0, 2),
    carbohydrate_sugar_100g: roundNumber(product.sugars_100g ?? 0, 2),

    fat_100g: nutritionFats,
    fat_trans_100g: nutritionTrans,
    fat_saturated_100g: nutritionSaturated,
    fat_unsaturated_100g: nutritionUnsaturated,

    micros_100g: {},
    icon_id: null,
  };
}

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const lang = request.nextUrl.searchParams.get("lang");

  if (!code) {
    return NextResponse.json(
      { error: "Please provide a code" },
      { status: 400 },
    );
  }

  if (!lang) {
    return NextResponse.json(
      { error: "Please provide a language" },
      { status: 400 },
    );
  }

  const product = await client.getProduct(code);

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  const productMapped = mapProduct(product, lang);
  return NextResponse.json(productMapped);
}
