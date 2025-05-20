import getUUID from "uuid-by-string";

import { Product } from "@/types";
import { GenericSearchData, ProductSearchData } from "@/schema";

// Get UUID from title, brand, quantity_original and quantity_original_unit
// This is probably very less than ideal
const getUUIDfromKey = (key: string, seed: string): string => {
  const keyArray = [key, seed];
  const keyJoined = keyArray.join("");

  return getUUID(keyJoined);
};

export const getProductFromSearch = ({
  seed,
  search,
  barcode,
}: {
  seed: string;
  search: ProductSearchData | GenericSearchData;
  barcode?: string;
}): Product => {
  const isGeneric = "category" in search;

  const parsedType = isGeneric ? "search_generic" : "search_product";
  const parsedKey = isGeneric
    ? search.title + search.category
    : search.title +
      search.brand +
      search.quantity_original +
      search.quantity_original_unit;

  const parsedUuid = getUUIDfromKey(parsedKey, seed);

  return {
    type: parsedType,
    uuid: parsedUuid,
    search,
    estimated: false,
    processing: true,

    title: null,
    brand: null,
    user_id: null,
    serving: null,
    options: null,
    barcode: barcode ?? null,
    category: null,
    quantity: null,
    embedding: null,

    icon_id: null,
    iron_100g: null,
    fiber_100g: null,
    sodium_100g: null,
    protein_100g: null,
    calorie_100g: null,
    calcium_100g: null,
    potassium_100g: null,
    cholesterol_100g: null,
    carbohydrate_100g: null,
    carbohydrate_sugar_100g: null,

    fat_100g: null,
    fat_trans_100g: null,
    fat_saturated_100g: null,
    fat_unsaturated_100g: null,

    updated_at: null,
    created_at: new Date().toISOString(),
  };
};
