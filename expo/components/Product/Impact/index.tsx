import Progress from "@/components/Progress";
import userData from "@/queries/userData";

import { Product } from "@/types/product";
import { ServingData } from "@/schemas/serving";
import { MealWithProduct } from "@/types/meal";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Fragment, Suspense } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import {
  getMacrosFromMeal,
  getMacrosFromProduct,
  macroToAbsolute,
} from "@/helper";

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

export default function ProductImpact({
  meal,
  product,
  serving,
}: ProductImpactProps) {
  const { data } = useSuspenseQuery(userData());
  const { calories: userCalories, macro: userMacro } = data!;

  const macros = product
    ? getMacrosFromProduct(product, serving)
    : getMacrosFromMeal(meal);

  const macrosTarget = macroToAbsolute(userMacro, userCalories);

  return (
    <View>
      <Text
        style={{
          fontSize: 16,
          fontFamily: "OpenSans_600SemiBold",
          marginBottom: 16,
        }}
      >
        Impact op je budget
      </Text>

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
                value={macros.calories}
                target={macrosTarget.calories}
                type="kcal"
              />

              <Progress
                label="Eiwitten"
                value={macros.protein}
                target={macrosTarget.protein}
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
                value={macros.carbs}
                target={macrosTarget.carbs}
              />

              <Progress
                label="Vetten"
                value={macros.fat}
                target={macrosTarget.fat}
              />
            </View>
          </Fragment>
        </Suspense>
      </View>
    </View>
  );
}
