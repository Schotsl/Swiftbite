import { RowMap } from "react-native-swipe-list-view";
import { ServingData } from "./schemas/serving";
import { ImageManipulatorContext, SaveFormat } from "expo-image-manipulator";
import { MealWithProduct, Option, Product, ProductInsert } from "./types";

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
  rowMap[rowKey]?.closeRow();
  setTimeout(() => {
    rowMap[rowKey]?.closeRow();
  }, 500);
};

export const getOptions = (product?: Product | ProductInsert) => {
  let options = [
    {
      title: "1 g",
      value: "1-gram",
      gram: 1,
    },
    {
      title: "100 g",
      value: "100-gram",
      gram: 100,
    },
  ];

  if (product?.quantity_original) {
    options.push({
      title: `Productinhoud (${product.quantity_original} ${product.quantity_original_unit})`,
      value: `quantity`,
      gram: product.quantity_original,
    });
  }

  if (product?.serving_original) {
    options.push({
      title: `Portiegrootte (${product.serving_original} ${product.serving_original_unit})`,
      value: `serving`,
      gram: product.serving_gram!,
    });
  }

  if (product?.options) {
    const productOptions = product?.options as Option[];

    productOptions.forEach((productOption) => {
      options.push({
        title: `${productOption.title} (${productOption.gram} g)`,
        value: productOption.value,
        gram: productOption.gram,
      });
    });
  }

  return options;
};

export const getToday = () => {
  const now = new Date();

  const startDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endingDay = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    23,
    59,
    59,
    999,
  );
  return {
    endDate: endingDay.toISOString(),
    startDate: startDay.toISOString(),
  };
};

export function getMacrosFromProduct(
  product: Product | ProductInsert,
  serving: ServingData,
  rounded = true,
): {
  fat: number;
  gram: number;
  carbs: number;
  protein: number;
  calories: number;
} {
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
    gram,
    carbs: rounded ? Math.round(carbsCalculated) : carbsCalculated,
    protein: rounded ? Math.round(proteinCalculated) : proteinCalculated,
    calories: rounded ? Math.round(caloriesCalculated) : caloriesCalculated,
  };
}

export function getMacrosFromMeal(meal: MealWithProduct): {
  fat: number;
  gram: number;
  carbs: number;
  protein: number;
  calories: number;
} {
  const products = meal.meal_product;
  const macros = products.reduce(
    (acc, product) => {
      const serving = {
        gram: product.selected_gram!,
        option: product.selected_option!,
        quantity: product.selected_quantity!,
      };

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
    },
  );

  return macros;
}
