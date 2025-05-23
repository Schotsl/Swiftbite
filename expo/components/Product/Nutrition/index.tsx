import { Product } from "@/types/product";
import { Fragment, useState } from "react";
import { ServingData } from "@/schemas/serving";
import { MealWithProduct } from "@/types/meal";
import { getMacrosFromMeal, getMacrosFromProduct } from "@/helper";
import { View, TouchableOpacity, ActivityIndicator } from "react-native";

import variables from "@/variables";

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
    ? getMacrosFromProduct(product, servingAdjusted)
    : getMacrosFromMeal(meal, servingAdjusted);

  const items = [
    {
      name: "Calorieën",
      value: macrosAdjusted.calories,
    },
    {
      name: "Eiwitten",
      value: macrosAdjusted.protein,
    },
    {
      name: "Vetten",
      value: macrosAdjusted.fat,
      items: [
        {
          name: "Waarvan verzadigd vet",
          value: macrosAdjusted.fatSaturated,
        },
        {
          name: "Waarvan onverzadigd vet",
          value: macrosAdjusted.fatUnsaturated,
        },
      ],
    },
    {
      name: "Koolhydraten",
      value: macrosAdjusted.carbs,
      items: [
        {
          name: "Waarvan suikers",
          value: macrosAdjusted.carbsSugars,
        },
      ],
    },
    {
      name: "Vezels",
      value: macrosAdjusted.fiber,
    },
    {
      name: "Zout",
      value: macrosAdjusted.salt,
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
          Voedingswaarde
        </TextBody>

        <TouchableOpacity onPress={handleSwitch}>
          <TextSmall
            style={{ textDecorationLine: isDifferent ? "underline" : "none" }}
          >
            {per100 ? "Per 100g" : `Per ${servingAdjusted.gram}g`}
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
              <TextBody>{item.value} g</TextBody>
            </View>

            {item.items &&
              item.items.map((item) => (
                <View
                  key={item.name}
                  style={{
                    paddingTop: 4,
                    paddingLeft: 16,
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <TextSmall weight="medium">{item.name}</TextSmall>
                  <TextSmall>{item.value} g</TextSmall>
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
          We zijn de voedingswaarden van dit product online aan het controleren.
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
