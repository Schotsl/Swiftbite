import { Product } from "@/types/product";
import { Fragment, useState } from "react";
import { ServingData } from "@/schemas/serving";
import { MealWithProduct } from "@/types/meal";
import { getMacrosFromMeal, getMacrosFromProduct } from "@/helper";
import { View, TouchableOpacity, ActivityIndicator } from "react-native";

import variables from "@/variables";
import language from "@/language";

import TextBody from "@/components/Text/Body";
import TextSmall from "@/components/Text/Small";

type ProductNutritionProps =
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

export default function ProductNutrition({
  meal,
  product,
  serving,
  processing,
}: ProductNutritionProps) {
  const [per100, setPer100] = useState(false);

  const servingAdjusted = per100
    ? {
        gram: 100,
        option: "100-gram",
        quantity: 1,
      }
    : serving;

  const macrosAdjusted = product
    ? getMacrosFromProduct(product, servingAdjusted, false)
    : getMacrosFromMeal(meal, servingAdjusted, false);

  const items = [
    {
      name: language.macros.calories.long,
      value: macrosAdjusted.calories,
      unit: language.macros.calories.short,
    },
    {
      name: language.macros.protein.long,
      value: macrosAdjusted.protein,
      unit: language.measurement.units.gram.short,
    },
    {
      name: language.macros.fats.long,
      value: macrosAdjusted.fat,
      unit: language.measurement.units.gram.short,
      items: [
        {
          name: language.components.information.which.saturated,
          value: macrosAdjusted.fatSaturated,
          unit: language.measurement.units.gram.short,
        },
        {
          name: language.components.information.which.unsaturated,
          value: macrosAdjusted.fatUnsaturated,
          unit: language.measurement.units.gram.short,
        },
      ],
    },
    {
      name: language.macros.carbs.long,
      value: macrosAdjusted.carbs,
      unit: language.measurement.units.gram.short,
      items: [
        {
          name: language.components.information.which.sugars,
          value: macrosAdjusted.carbsSugars,
          unit: language.measurement.units.gram.short,
        },
      ],
    },
    {
      name: language.macros.nutrients.carbs.fiber,
      value: macrosAdjusted.fiber,
      unit: language.measurement.units.gram.short,
    },
    {
      name: language.macros.nutrients.salt,
      value: macrosAdjusted.salt,
      unit: language.measurement.units.gram.short,
    },
  ];

  const handleSwitch = () => {
    setPer100((previous) => !previous);
  };

  const isDifferent = serving.gram !== 100;

  return (
    <View>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <TextBody weight="semibold" style={{ marginBottom: 16 }}>
          {language.components.information.nutrition}
        </TextBody>

        <TouchableOpacity onPress={handleSwitch}>
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
          position: "relative",
          borderColor: variables.border.color,
          borderWidth: variables.border.width,
          borderRadius: variables.border.radius,
        }}
      >
        {processing && <ProductNutritionProcessing />}
        {items.map((item, index) => (
          <View
            key={item.name}
            style={{
              padding: 16,
              flexDirection: "column",
              borderColor: variables.border.color,
              borderBottomWidth:
                index === items.length - 1 ? 0 : variables.border.width,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <TextBody weight="medium">{item.name}</TextBody>
              <TextBody>
                {item.value} {item.unit}
              </TextBody>
            </View>

            {item.items &&
              item.items.map((subItem) => (
                <View
                  key={subItem.name}
                  style={{
                    paddingTop: 4,
                    paddingLeft: 16,
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <TextSmall weight="medium">{subItem.name}</TextSmall>
                  <TextSmall>
                    {subItem.value} {subItem.unit}
                  </TextSmall>
                </View>
              ))}
          </View>
        ))}
      </View>
    </View>
  );
}

export function ProductNutritionProcessing() {
  return (
    <Fragment>
      <View
        style={{
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 2,
          position: "absolute",

          gap: 12,
          padding: 16,
          alignItems: "flex-start",
          flexDirection: "column",
        }}
      >
        <ActivityIndicator size="small" color={variables.colors.text.primary} />

        <TextSmall weight="semibold">
          {language.components.information.processing.primary}
        </TextSmall>
      </View>

      <View
        style={{
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1,
          position: "absolute",

          opacity: 0.96,
          borderRadius: variables.border.radius,
          backgroundColor: variables.colors.white,
        }}
      />
    </Fragment>
  );
}
