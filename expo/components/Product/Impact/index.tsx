import Progress from "@/components/Progress";
import userData from "@/queries/userData";

import { Product } from "@/types/product";
import { useQuery } from "@tanstack/react-query";
import { ServingData } from "@/schemas/serving";
import { MealWithProduct } from "@/types/meal";
import { Fragment, Suspense, useState } from "react";
import { View, ActivityIndicator, TouchableOpacity } from "react-native";
import {
  macrosToCalories,
  getMacrosFromMeal,
  getMacrosFromProduct,
} from "@/helper";

import variables from "@/variables";
import language from "@/language";

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

  const { data, isLoading } = useQuery(userData());

  const userCalories = data ? data.calories : 0;
  const userMacro = data
    ? data.macro
    : {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
      };

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
          {language.components.information.impact}
        </TextBody>

        <TouchableOpacity onPress={isDifferent ? handleSwitch : undefined}>
          <TextSmall
            style={{ textDecorationLine: isDifferent ? "underline" : "none" }}
          >
            {per100
              ? language.components.information.per100g
              : language.components.information.getServing(
                  servingAdjusted.gram,
                )}
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
        {processing || isLoading ? (
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
                  label={language.macros.calories.long}
                  value={macrosAdjusted.calories}
                  target={target.calories}
                  type="kcal"
                />

                <Progress
                  label={language.macros.protein.long}
                  color={variables.macros.protein.background}
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
                  label={language.macros.carbs.long}
                  color={variables.macros.carbs.background}
                  value={macrosAdjusted.carbs}
                  target={target.carbs}
                />

                <Progress
                  label={language.macros.fats.long}
                  color={variables.macros.fats.background}
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
        {language.components.information.processing.primary}
      </TextSmall>

      <TextSmall>
        {language.components.information.processing.secondary}
      </TextSmall>
    </View>
  );
}
