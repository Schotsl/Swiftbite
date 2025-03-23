import { NextResponse } from "next/server";
import { IngredientInsert } from "@/types";
import { roundNumber } from "@/helper";

// TODO: This is a temporary interface for the OpenFoodProductS
interface OpenFoodProduct {
  code: string;
  product_name: string;
  brands: string;
  image_front_url: string;
  nutriments: {
    fat_100g: number;
    "trans-fat_100g"?: number;
    "saturated-fat_100g"?: number;
    iron_100g?: number;
    fiber_100g?: number;
    sodium_100g?: number;
    proteins_100g?: number;
    calcium_100g?: number;
    "energy-kcal_100g"?: number;
    potassium_100g?: number;
    cholesterol_100g?: number;
    carbohydrates_100g?: number;
    sugars_100g?: number;
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const code = searchParams.get("code");
  const query = searchParams.get("query");

  const lang = searchParams.get("lang");
  const limit = searchParams.get("limit");
  const offset = searchParams.get("offset");

  // https://search.openfoodfacts.org/search?q=coca cola&langs=nl&page_size=10&page=1

  // If no code or query
  if (!code && !query) {
    return NextResponse.json(
      { error: "Code or query is required" },
      { status: 400 }
    );
  }

  // If both code and query are provided
  if (code && query) {
    return NextResponse.json(
      { error: "Only one of code or query is allowed" },
      { status: 400 }
    );
  }

  if (query) {
    const params = new URLSearchParams();
    const base = `https://search.openfoodfacts.org/search`;

    if (lang) params.append("langs", lang);
    if (limit) params.append("page_size", limit);
    if (offset) params.append("page", offset);

    params.append("q", query);

    const url = `${base}?${params.toString()}`;
    const response = await fetch(url);
    const data = await response.json();

    const products = data.hits;
    const nutritions = products.map(mapNutrition);

    return NextResponse.json(nutritions);
  }

  const url = `https://world.openfoodfacts.org/api/v3/product/${code}.json`;
  const response = await fetch(url);
  const data = await response.json();

  if (!data.product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  const product = data.product;
  const nutrition = mapNutrition(product);

  return NextResponse.json(nutrition);
}

const mapNutrition = (product: OpenFoodProduct): IngredientInsert => {
  const nutriments = product.nutriments;
  const nutritionPortion = roundNumber(+nutriments.fat_100g);

  const nutritionFats = roundNumber(nutriments.fat_100g ?? 0);
  const nutritionTrans = roundNumber(nutriments["trans-fat_100g"] ?? 0);
  const nutritionSaturated = roundNumber(nutriments["saturated-fat_100g"] ?? 0);
  const nutritionUnsaturated = roundNumber(
    nutritionFats - nutritionSaturated - nutritionTrans
  );

  return {
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
};
