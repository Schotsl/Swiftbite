import Progress from "@/components/Progress";
import userData from "@/queries/userData";

import { Product } from "@/types/product";
import { ServingData } from "@/schemas/serving";
import { MealWithProduct } from "@/types/meal";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Fragment, Suspense, useState } from "react";
import { View, ActivityIndicator, TouchableOpacity } from "react-native";
import {
  macrosToCalories,
  getMacrosFromMeal,
  getMacrosFromProduct,
} from "@/helper";

import variables from "@/variables";
import TextSmall from "@/components/Text/Small";
import TextBody from "@/components/Text/Body";

type ProductImpactProps =
  | {
      meal?: never;
      product: Product;
      serving: ServingData;
      processing?: boolean;
    }
  | {
      meal: MealWithProduct;
      product?: never;
      serving: ServingData;
      processing?: boolean;
    };

export default function ProductImpact({
  meal,
  product,
  serving,
  processing,
}: ProductImpactProps) {
  const [per100, setPer100] = useState(false);

  const { data } = useSuspenseQuery(userData());
  const { calories: userCalories, macro: userMacro } = data!;

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

  const target = macrosToCalories(userMacro, userCalories);

  const handleSwitch = () => {
    setPer100((previous) => !previous);
  };

  const isDifferent = serving.gram !== 100;

  return (
    <View>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <TextBody weight="semibold" style={{ marginBottom: 16 }}>
          Impact op je budget
        </TextBody>

        <TouchableOpacity onPress={isDifferent ? handleSwitch : undefined}>
          <TextSmall
            style={{ textDecorationLine: isDifferent ? "underline" : "none" }}
          >
            {per100 ? "Per 100g" : `Per ${servingAdjusted.gram}g`}
          </TextSmall>
        </TouchableOpacity>
      </View>

      <View
        style={{
          gap: 16,
          height: 186,
          padding: 16,

          borderColor: variables.border.color,
          borderWidth: variables.border.width,
          borderRadius: variables.border.radius,

          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {processing ? (
          <ProductImpactProcessing />
        ) : (
          <Suspense
            fallback={
              <ActivityIndicator
                size="small"
                color={variables.colors.text.primary}
              />
            }
          >
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
        )}
      </View>
    </View>
  );
}

export function ProductImpactProcessing() {
  return (
    <View
      style={{ gap: 12, flexDirection: "column", alignItems: "flex-start" }}
    >
      <ActivityIndicator size="small" color={variables.colors.text.primary} />

      <TextSmall weight="semibold">
        We zijn de voedingswaarden van dit product online aan het controleren.
      </TextSmall>

      <TextSmall>
        Dit kan tot een minuut duren, maar voel je vrij om het product alvast
        aan je logs toe te voegen.
      </TextSmall>
    </View>
  );
}
