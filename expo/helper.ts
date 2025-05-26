import { User } from "@/types/user";
import { RowMap } from "react-native-swipe-list-view";
import { MacroData } from "./schemas/personal/goal";
import { ServingData } from "./schemas/serving";
import { Product, ProductInsert } from "@/types/product";
import { MealWithProduct, MealProductBase } from "@/types/meal";
import { ImageManipulatorContext, SaveFormat } from "expo-image-manipulator";
import { Image, Macro, MacroExpanded, OptionWithGram } from "./types";

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
      title: "1 g",
      value: "1-gram",
    },
    {
      gram: 100,
      title: "100 g",
      value: "100-gram",
    },
  ];

  if (meal) {
    options.push({
      gram: meal.quantity_gram,
      title: `Standaardmaaltijd (${meal.quantity_gram} g)`,
      value: `meal`,
    });
  }

  // TODO: language
  if (product?.quantity) {
    options.push({
      gram: product.quantity.gram,
      title: `Productinhoud (${displayQuantity(product.quantity)})`,
      value: `quantity`,
    });
  }

  if (product?.serving) {
    options.push({
      gram: product.serving?.gram,
      title: `Portiegrootte (${displayQuantity(product.serving)})`,
      value: `serving`,
    });
  }

  if (product?.options) {
    const productOptions = product?.options as OptionWithGram[];

    productOptions.forEach((productOption) => {
      options.push({
        gram: productOption.gram,
        title: `${productOption.title} (${productOption.gram} g)`,
        value: productOption.value,
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

  return {
    gram: gram,

    fat: rounded ? Math.round(fatCalculated) : fatCalculated,
    fatSaturated: rounded
      ? Math.round(fatSaturatedCalculated)
      : fatSaturatedCalculated,
    fatUnsaturated: rounded
      ? Math.round(fatUnsaturatedCalculated)
      : fatUnsaturatedCalculated,

    carbs: rounded ? Math.round(carbsCalculated) : carbsCalculated,
    carbsSugars: rounded
      ? Math.round(carbsSugarsCalculated)
      : carbsSugarsCalculated,

    salt: rounded ? Math.round(saltCalculated) : saltCalculated,
    fiber: rounded ? Math.round(fiberCalculated) : fiberCalculated,
    protein: rounded ? Math.round(proteinCalculated) : proteinCalculated,
    calories: rounded ? Math.round(caloriesCalculated) : caloriesCalculated,
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

  return {
    gram: rounded
      ? Math.round((macros.gram / macros.gram) * serving.gram)
      : (macros.gram / macros.gram) * serving.gram,

    fat: rounded
      ? Math.round((macros.fat / macros.gram) * serving.gram)
      : (macros.fat / macros.gram) * serving.gram,

    fatSaturated: rounded
      ? Math.round((macros.fatSaturated / macros.gram) * serving.gram)
      : (macros.fatSaturated / macros.gram) * serving.gram,

    fatUnsaturated: rounded
      ? Math.round((macros.fatUnsaturated / macros.gram) * serving.gram)
      : (macros.fatUnsaturated / macros.gram) * serving.gram,

    carbs: rounded
      ? Math.round((macros.carbs / macros.gram) * serving.gram)
      : (macros.carbs / macros.gram) * serving.gram,

    carbsSugars: rounded
      ? Math.round((macros.carbsSugars / macros.gram) * serving.gram)
      : (macros.carbsSugars / macros.gram) * serving.gram,

    salt: rounded
      ? Math.round((macros.salt / macros.gram) * serving.gram)
      : (macros.salt / macros.gram) * serving.gram,

    fiber: rounded
      ? Math.round((macros.fiber / macros.gram) * serving.gram)
      : (macros.fiber / macros.gram) * serving.gram,

    protein: rounded
      ? Math.round((macros.protein / macros.gram) * serving.gram)
      : (macros.protein / macros.gram) * serving.gram,

    calories: rounded
      ? Math.round((macros.calories / macros.gram) * serving.gram)
      : (macros.calories / macros.gram) * serving.gram,
  };
}

export const transformDate = (date: Date | string | number): string => {
  const dateObject = new Date(date);
  return dateObject.toLocaleDateString("nl-NL", {
    day: "2-digit",
    month: "long",
    year: "numeric",
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

export function displayQuantity(serving: { option: string; quantity: number }) {
  const { option, quantity } = serving;

  let optionFormatted = option;

  if (option === "l") {
    optionFormatted = "L";
  } else if (option === "ml") {
    optionFormatted = "mL";
  }

  return `${quantity} ${optionFormatted}`;
}
