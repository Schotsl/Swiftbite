import { Product } from "@/types/product";
import { View, Text } from "react-native";
import { ServingData } from "@/schemas/serving";
import { getMacrosFromProduct } from "@/helper";

type ProductNutritionProps = {
  product: Product;
  serving: ServingData;
};

export default function ProductNutrition({
  product,
  serving,
}: ProductNutritionProps) {
  const macros = getMacrosFromProduct(product, serving);
  const items = [
    {
      name: "Calorieën",
      value: macros.calories,
    },
    {
      name: "Eiwitten",
      value: macros.protein,
    },
    {
      name: "Vetten",
      value: macros.fat,
      items: [
        {
          name: "Waarvan verzadigd vet",
          value: macros.fatSaturated,
        },
        {
          name: "Waarvan onverzadigd vet",
          value: macros.fatUnsaturated,
        },
      ],
    },
    {
      name: "Koolhydraten",
      value: macros.carbs,
      items: [
        {
          name: "Waarvan suikers",
          value: macros.carbsSugars,
        },
      ],
    },
    {
      name: "Vezels",
      value: macros.fiber,
    },
    {
      name: "Zout",
      value: macros.salt,
    },
  ];

  return (
    <View>
      <Text
        style={{
          fontSize: 16,
          fontFamily: "OpenSans_600SemiBold",
          marginBottom: 16,
        }}
      >
        Voedingswaarde
      </Text>

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
