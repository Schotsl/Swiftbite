import { Product } from "@/types/product";
import { useState } from "react";
import { ServingData } from "@/schemas/serving";
import { MealWithProduct } from "@/types/meal";
import { View, Text, TouchableOpacity } from "react-native";
import { getMacrosFromMeal, getMacrosFromProduct } from "@/helper";

type ProductNutritionProps =
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

export default function ProductNutrition({
  meal,
  product,
  serving,
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
          Voedingswaarde
        </Text>

        <TouchableOpacity onPress={handleSwitch}>
          <Text
            style={{
              fontSize: 14,
              fontFamily: "OpenSans_400Regular",
              textDecorationLine: "underline",
            }}
          >
            {per100 ? "Per 100g" : `Per ${servingAdjusted.gram}g`}
          </Text>
        </TouchableOpacity>
      </View>

      <View
        style={{
          borderWidth: 2,
          borderColor: "#000",
          borderRadius: 8,
        }}
      >
        {items.map((item, index) => (
          <View
            key={item.name}
            style={{
              padding: 16,
              flexDirection: "column",
              borderColor: "#000",
              borderBottomWidth: index === items.length - 1 ? 0 : 2,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: "OpenSans_400Regular",
                }}
              >
                {item.name}
              </Text>

              <Text
                style={{
                  fontSize: 16,
                  fontFamily: "OpenSans_600SemiBold",
                }}
              >
                {item.value} g
              </Text>
            </View>

            {item.items &&
              item.items.map((item) => (
                <View
                  key={item.name}
                  style={{
                    paddingLeft: 16,
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: "OpenSans_400Regular",
                    }}
                  >
                    {item.name}
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: "OpenSans_600SemiBold",
                    }}
                  >
                    {item.value} g
                  </Text>
                </View>
              ))}
          </View>
        ))}
      </View>
    </View>
  );
}
