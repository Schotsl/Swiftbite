import { RowMap } from "react-native-swipe-list-view";
import { ServingData } from "./schemas/serving";
import { ImageManipulatorContext, SaveFormat } from "expo-image-manipulator";
import {
  Product,
  ProductInsert,
  MealWithProduct,
  MacroAbsolute,
  OptionWithGram,
  MealProduct,
} from "./types";
import { MacroData } from "./schemas/personal/goal";

export const renderToBase64 = async (
  manipulator: ImageManipulatorContext,
  compressed: boolean
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
  rowMap[rowKey]?.closeRow();
  setTimeout(() => {
    rowMap[rowKey]?.closeRow();
  }, 500);
};

export const getOptions = ({
  meal,
  product,
}: {
  meal?: MealWithProduct;
  product?: Product | ProductInsert;
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

  if (product?.quantity) {
    options.push({
      gram: product.quantity.gram,
      title: `Productinhoud (${product.quantity.gram} ${product.quantity.option})`,
      value: `quantity`,
    });
  }

  if (product?.serving) {
    options.push({
      gram: product.serving?.gram,
      title: `Portiegrootte (${product.serving?.gram} ${product.serving?.option})`,
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

export const singleMacroToAbsolute = (
  type: keyof MacroData,
  value: number,
  calories: number
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

// TODO: Might wanna rename this to "macroToAbsolute" and "macrosToAbsolute" but I'd have to double check every where in the codebase for proper single and plural usage.
export const macroToAbsolute = (
  macro: MacroData,
  calories: number
): MacroAbsolute => {
  return {
    fat: singleMacroToAbsolute("fat", macro.fat, calories),
    carbs: singleMacroToAbsolute("carbs", macro.carbs, calories),
    protein: singleMacroToAbsolute("protein", macro.protein, calories),
    calories: calories,
  };
};

export const getRange = (date = new Date()) => {
  const startDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );

  const endDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    23,
    59,
    59,
    999
  );

  return {
    endDate,
    startDate,
  };
};

export function getMacrosFromProduct(
  product: Product | ProductInsert,
  serving: ServingData,
  rounded = true
): MacroAbsolute & { gram: number } {
  const gram = serving.gram || 0;

  const fat = product?.fat_100g || 0;
  const carbs = product?.carbohydrate_100g || 0;
  const protein = product?.protein_100g || 0;
  const calories = product?.calorie_100g || 0;

  const fatCalculated = (fat / 100) * gram;
  const carbsCalculated = (carbs / 100) * gram;
  const proteinCalculated = (protein / 100) * gram;
  const caloriesCalculated = (calories / 100) * gram;

  return {
    fat: rounded ? Math.round(fatCalculated) : fatCalculated,
    gram: gram,
    carbs: rounded ? Math.round(carbsCalculated) : carbsCalculated,
    protein: rounded ? Math.round(proteinCalculated) : proteinCalculated,
    calories: rounded ? Math.round(caloriesCalculated) : caloriesCalculated,
  };
}

export function getMacrosFromMeal(
  meal: MealWithProduct
): MacroAbsolute & { gram: number } {
  const products = meal.meal_products || [];
  const macros = products.reduce(
    (acc, product) => {
      const serving = product.serving;
      const macros = getMacrosFromProduct(product.product, serving);

      return {
        fat: acc.fat + macros.fat,
        gram: acc.gram + macros.gram,
        carbs: acc.carbs + macros.carbs,
        protein: acc.protein + macros.protein,
        calories: acc.calories + macros.calories,
      };
    },
    {
      fat: 0,
      gram: 0,
      carbs: 0,
      protein: 0,
      calories: 0,
    }
  );

  return macros;
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
  height?: string
) => {
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
  meal: Omit<MealWithProduct, "quantity_gram">
): MealWithProduct => {
  const total =
    meal.meal_products?.reduce(
      (sum: number, item: MealProduct) => sum + item.serving.gram,
      0
    ) || 0;

  return { ...meal, quantity_gram: total };
};
