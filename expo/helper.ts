import { User } from "@/types/user";
import { RowMap } from "react-native-swipe-list-view";
import { MacroData } from "./schemas/personal/goal";
import { ServingData } from "./schemas/serving";
import { Product, ProductInsert } from "@/types/product";
import { MealWithProduct, MealProductBase } from "@/types/meal";
import { ImageManipulatorContext, SaveFormat } from "expo-image-manipulator";
import { Image, Macro, MacroExpanded, OptionWithGram } from "./types";

import language from "./language";

export const renderToBase64 = async (
  manipulator: ImageManipulatorContext,
  compressed: boolean,
) => {
  const format = SaveFormat.JPEG;
  const base64 = true;
  const compress = compressed ? 0.5 : 1;

  const manipulatorRender = await manipulator.renderAsync();
  const manipulatorSaved = await manipulatorRender.saveAsync({
    format,
    base64,
    compress,
  });

  return manipulatorSaved.base64!;
};

export const handleError = (error: Error | null) => {
  if (error) {
    console.log(error);

    throw new Error(error.message);
  }
};

export const rowTimeout = <T>(rowKey: string, rowMap: RowMap<T>) => {
  setTimeout(() => {
    rowMap[rowKey]?.closeRow();
  }, 500);
};

export const getOption = ({ serving, quantity }: Product) => {
  if (serving) {
    return "serving";
  }

  if (quantity) {
    return "quantity";
  }

  return "100-gram";
};

export const getOptions = ({
  meal,
  product,
}: {
  meal?: MealWithProduct;
  product?: Product;
}): OptionWithGram[] => {
  let options = [
    {
      gram: 1,
      title: `1 ${language.measurement.units.gram.short}`,
      value: "1-gram",
    },
    {
      gram: 100,
      title: `100 ${language.measurement.units.gram.short}`,
      value: "100-gram",
    },
  ];

  if (meal) {
    options.push({
      gram: meal.quantity_gram,
      value: `meal`,
      title: language.options.getMeal(
        meal.quantity_gram,
        language.measurement.units.gram.short,
      ),
    });
  }

  if (product?.quantity) {
    options.push({
      gram: product.quantity.gram,
      value: `quantity`,
      title: language.options.getQuantity(
        product.quantity.quantity,
        product.quantity.option,
      ),
    });
  } else if (product?.search?.quantity_original) {
    options.push({
      gram: product.search.quantity_original,
      value: `quantity`,
      title: language.options.getQuantity(
        product.search.quantity_original,
        product.search.quantity_original_unit!,
      ),
    });
  }

  if (product?.serving) {
    options.push({
      gram: product.serving?.gram,
      value: `serving`,
      title: language.options.getServing(
        product.serving.quantity,
        product.serving.option,
      ),
    });
  }

  if (product?.options) {
    const productOptions = product?.options as OptionWithGram[];

    productOptions.forEach((productOption) => {
      options.push({
        gram: productOption.gram,
        value: productOption.value,
        title: language.options.getOption(
          productOption.title,
          productOption.gram,
          language.measurement.units.gram.short,
        ),
      });
    });
  }

  return options;
};

export function getMacrosFromProduct(
  product: Product | ProductInsert,
  serving: ServingData,
  rounded = true,
): MacroExpanded & { gram: number } {
  const gram = serving.gram || 0;

  // Fields too add, waarvan verzadigd vet, waarvan onverzadigd vet, waarvan suikers, waarvan vezels, waarvan zout

  const fat = product?.fat_100g || 0;
  const fatSaturated = product?.fat_saturated_100g || 0;
  const fatUnsaturated = product?.fat_unsaturated_100g || 0;

  const carbs = product?.carbohydrate_100g || 0;
  const carbsSugars = product?.carbohydrate_sugar_100g || 0;

  const salt = product?.sodium_100g || 0;
  const fiber = product?.fiber_100g || 0;
  const protein = product?.protein_100g || 0;
  const calories = product?.calorie_100g || 0;

  const fatCalculated = (fat / 100) * gram;
  const fatSaturatedCalculated = (fatSaturated / 100) * gram;
  const fatUnsaturatedCalculated = (fatUnsaturated / 100) * gram;

  const carbsCalculated = (carbs / 100) * gram;
  const carbsSugarsCalculated = (carbsSugars / 100) * gram;

  const saltCalculated = (salt / 100) * gram;
  const fiberCalculated = (fiber / 100) * gram;
  const proteinCalculated = (protein / 100) * gram;
  const caloriesCalculated = (calories / 100) * gram;

  const decimals = rounded ? 0 : 2;

  return {
    gram: gram,

    fat: roundNumber(fatCalculated, decimals),
    fatSaturated: roundNumber(fatSaturatedCalculated, decimals),
    fatUnsaturated: roundNumber(fatUnsaturatedCalculated, decimals),

    carbs: roundNumber(carbsCalculated, decimals),
    carbsSugars: roundNumber(carbsSugarsCalculated, decimals),

    salt: roundNumber(saltCalculated, decimals),
    fiber: roundNumber(fiberCalculated, decimals),
    protein: roundNumber(proteinCalculated, decimals),
    calories: roundNumber(caloriesCalculated, decimals),
  };
}

export const macroToCalories = (
  type: keyof MacroData,
  value: number,
  calories: number,
) => {
  let divider = 4;

  if (type === "protein") {
    divider = 4;
  } else if (type === "fat") {
    divider = 9;
  }

  const grams = (calories * value) / divider;
  const gramsRounded = Math.round(grams);

  return gramsRounded;
};

export const macrosToCalories = (macro: MacroData, calories: number): Macro => {
  return {
    fat: macroToCalories("fat", macro.fat, calories),
    carbs: macroToCalories("carbs", macro.carbs, calories),
    protein: macroToCalories("protein", macro.protein, calories),
    calories: calories,
  };
};

export function getMacrosFromMeal(
  meal: MealWithProduct,
  serving: ServingData,
  rounded = true,
): MacroExpanded & { gram: number } {
  const products = meal.meal_products || [];
  const macros = products.reduce(
    (acc, product) => {
      const serving = product.serving;
      const macros = getMacrosFromProduct(product.product, serving);

      return {
        gram: acc.gram + macros.gram,

        fat: acc.fat + macros.fat,
        fatSaturated: acc.fatSaturated + macros.fatSaturated,
        fatUnsaturated: acc.fatUnsaturated + macros.fatUnsaturated,

        carbs: acc.carbs + macros.carbs,
        carbsSugars: acc.carbsSugars + macros.carbsSugars,

        salt: acc.salt + macros.salt,
        fiber: acc.fiber + macros.fiber,
        protein: acc.protein + macros.protein,
        calories: acc.calories + macros.calories,
      };
    },
    {
      gram: 0,

      fat: 0,
      fatSaturated: 0,
      fatUnsaturated: 0,

      carbs: 0,
      carbsSugars: 0,

      salt: 0,
      fiber: 0,
      protein: 0,
      calories: 0,
    },
  );

  const grams = (macros.gram / macros.gram) * serving.gram;
  const salt = (macros.salt / macros.gram) * serving.gram;
  const fiber = (macros.fiber / macros.gram) * serving.gram;
  const protein = (macros.protein / macros.gram) * serving.gram;
  const calories = (macros.calories / macros.gram) * serving.gram;

  const fat = (macros.fat / macros.gram) * serving.gram;
  const fatSaturated = (macros.fatSaturated / macros.gram) * serving.gram;
  const fatUnsaturated = (macros.fatUnsaturated / macros.gram) * serving.gram;

  const carbs = (macros.carbs / macros.gram) * serving.gram;
  const carbsSugars = (macros.carbsSugars / macros.gram) * serving.gram;

  const decimals = rounded ? 0 : 2;

  return {
    gram: roundNumber(grams, decimals),
    salt: roundNumber(salt, decimals),
    fiber: roundNumber(fiber, decimals),
    protein: roundNumber(protein, decimals),
    calories: roundNumber(calories, decimals),

    fat: roundNumber(fat, decimals),
    fatSaturated: roundNumber(fatSaturated, decimals),
    fatUnsaturated: roundNumber(fatUnsaturated, decimals),

    carbs: roundNumber(carbs, decimals),
    carbsSugars: roundNumber(carbsSugars, decimals),
  };
}

export const transformDate = (
  date: Date | string | number,
  short = false,
): string => {
  const dateObject = new Date(date);
  return dateObject.toLocaleDateString("nl-NL", {
    day: "2-digit",
    month: short ? "short" : "long",
    year: short ? undefined : "numeric",
  });
};

export const transformImage = (
  uri?: string,
  width?: string,
  height?: string,
): Image | null => {
  const complete = uri && width && height;

  if (complete) {
    return {
      uri,
      width: parseInt(width),
      height: parseInt(height),
    };
  }

  return null;
};

export const mapMeal = (
  meal: Omit<MealWithProduct, "quantity_gram">,
): MealWithProduct => {
  const total =
    meal.meal_products?.reduce(
      (sum: number, item: MealProductBase) => sum + item.serving.gram,
      0,
    ) || 0;

  return { ...meal, quantity_gram: total };
};

export function isProductFavorite(
  user: User | undefined,
  product: string,
): boolean {
  if (!user) {
    return false;
  }

  return user.favorite_products.includes(product);
}

export function isMealFavorite(user: User | undefined, meal: string): boolean {
  if (!user) {
    return false;
  }

  return user.favorite_meals?.includes(meal);
}

export function toggleProductFavorite(
  user: User | undefined,
  product: string,
): string[] {
  if (!user) {
    return [product];
  }

  const favorite = isProductFavorite(user, product);
  const favoriteArray = favorite
    ? user.favorite_products.filter((id) => id !== product)
    : [...user.favorite_products, product];

  return favoriteArray;
}

export function toggleMealFavorite(
  user: User | undefined,
  meal: string,
): string[] {
  if (!user) {
    return [meal];
  }

  const favorite = isMealFavorite(user, meal);
  const favoriteArray = favorite
    ? user.favorite_meals.filter((id) => id !== meal)
    : [...user.favorite_meals, meal];

  return favoriteArray;
}

export const getLabel = (value: string) => {
  if (value === "l") {
    return "L";
  } else if (value === "ml") {
    return "mL";
  }

  return value;
};

export const getDateRange = (date: Date) => {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);

  const end = new Date(date);
  end.setHours(23, 59, 59, 999);

  return {
    end,
    start,
  };
};

export const getDateKey = (date: Date) => {
  const day = date.getDate();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;

  return `${year}-${month}-${day}`;
};

export const roundNumber = (number: number, decimals = 2) => {
  const factor = Math.pow(10, decimals);
  const rounded = Math.round(number * factor);

  return rounded / factor;
};

console.log(roundNumber(1.23456789, 2));
