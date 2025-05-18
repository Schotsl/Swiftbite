import Progress from "@/components/Progress";
import userData from "@/queries/userData";

import { Product } from "@/types/product";
import { ServingData } from "@/schemas/serving";
import { MealWithProduct } from "@/types/meal";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Fragment, Suspense, useState } from "react";
import { View, Text, ActivityIndicator, TouchableOpacity } from "react-native";
import {
  getMacrosFromMeal,
  getMacrosFromProduct,
  getOptions,
  macroToAbsolute,
} from "@/helper";
import { MacroData } from "@/schemas/personal/goal";
import { Macro } from "@/types";

type ProductImpactProps =
  | {
      meal?: never;
      product: Product;
      serving: ServingData;
    }
  | {
      meal: MealWithProduct;
      product?: never;
      serving: ServingData;
    };

export const macroToCalories = (
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

export const macrosToCalories = (macro: MacroData, calories: number): Macro => {
  return {
    fat: macroToCalories("fat", macro.fat, calories),
    carbs: macroToCalories("carbs", macro.carbs, calories),
    protein: macroToCalories("protein", macro.protein, calories),
    calories: calories,
  };
};

export default function ProductImpact({
  meal,
  product,
  serving,
}: ProductImpactProps) {
  const [per100, setPer100] = useState(false);

  const { data } = useSuspenseQuery(userData());
  const { calories: userCalories, macro: userMacro } = data!;

  const options = getOptions({ meal, product });
  const option = options.find((option) => option.value === serving.option);

  const servingAdjusted = per100
    ? {
        gram: 100,
        option: "100-gram",
        quantity: 1,
      }
    : serving;

  const macrosAdjusted = product
    ? getMacrosFromProduct(product, servingAdjusted)
    : getMacrosFromMeal(meal, servingAdjusted);

  const target = macroToAbsolute(userMacro, userCalories);

  const handleSwitch = () => {
    setPer100((previous) => !previous);
  };

  return (
    <View>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text
          style={{
            fontSize: 16,
            fontFamily: "OpenSans_600SemiBold",
            marginBottom: 16,
          }}
        >
          Impact op je budget
        </Text>

        <TouchableOpacity onPress={handleSwitch}>
          <Text
            style={{
              fontSize: 14,
              fontFamily: "OpenSans_400Regular",
              textDecorationLine: "underline",
            }}
          >
            {per100 ? "Per 100g" : `Per ${serving.quantity} ${option?.title}`}
          </Text>
        </TouchableOpacity>
      </View>

      <View
        style={{
          gap: 16,
          height: 186,
          padding: 16,

          borderWidth: 2,
          borderColor: "#000",
          borderRadius: 8,

          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Suspense fallback={<ActivityIndicator size="small" color="#000" />}>
          <Fragment>
            <View
              style={{
                gap: 16,
                flexDirection: "row",
              }}
            >
              <Progress
                label="Calorieën"
                value={macrosAdjusted.calories}
                target={target.calories}
                type="kcal"
              />

              <Progress
                label="Eiwitten"
                value={macrosAdjusted.protein}
                target={target.protein}
              />
            </View>

            <View
              style={{
                gap: 16,
                flexDirection: "row",
              }}
            >
              <Progress
                label="Carbs"
                value={macrosAdjusted.carbs}
                target={target.carbs}
              />

              <Progress
                label="Vetten"
                value={macrosAdjusted.fat}
                target={target.fat}
              />
            </View>
          </Fragment>
        </Suspense>
      </View>
    </View>
  );
}
