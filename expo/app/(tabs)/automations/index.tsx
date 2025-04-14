import { FontAwesome6 } from "@expo/vector-icons";
import { useSuspenseQuery } from "@tanstack/react-query";
import { StyleSheet, Text, View } from "react-native";

import Icon from "@/components/Icon";
import mealData from "@/queries/mealData";

export default function Tab() {
  const { data } = useSuspenseQuery({
    ...mealData({}),
  });

  return (
    <View
      style={{
        borderWidth: 2,
        flexDirection: "column",
        paddingVertical: 16,
        paddingHorizontal: 32,
        borderLeftWidth: 0,
        borderRightWidth: 0,
      }}
    >
      {data.map((meal) => (
        <View key={meal.uuid} style={{ flexDirection: "row", gap: 16 }}>
          <Icon iconId={meal.icon_id} />

          <View style={{ gap: 4 }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "semibold",
              }}
            >
              {meal.title}
            </Text>

            <View style={{ flexDirection: "row", gap: 6 }}>
              <FontAwesome6 name="bowl-food" size={14} color="#545454" />

              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "regular",
                  color: "#545454",
                }}
              >
                {meal.meal_product.length} ingrediënten
              </Text>
            </View>
          </View>

          <View
            style={{
              flex: 1,
              alignItems: "flex-end",
              justifyContent: "flex-end",
            }}
          >
            <Text
              style={{
                color: "#545454",
                fontSize: 14,
                fontWeight: "regular",
              }}
            >
              400 kcal
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}
