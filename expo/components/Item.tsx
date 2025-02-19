import { FoodItem } from "@/types";

import { View, Text, Image } from "react-native";

export default function Item({ nutrition, title }: FoodItem) {
  return (
    <View
      style={{
        gap: 12,
        padding: 16,
        flexDirection: "row",
        backgroundColor: "#FFF",
        borderBottomWidth: 1,
        borderBottomColor: "rgba(0, 0, 0, 0.1)",
      }}
    >
      <Image
        source={require("../assets/images/burger.png")}
        style={{ width: 38, height: 38 }}
      />

      <View style={{ gap: 2 }}>
        <Text style={{ fontSize: 16 }}>{title ? title : "Loading..."}</Text>
        <Text style={{ fontSize: 14 }}>
          {nutrition ? nutrition.calories : "Loading..."} kcal
        </Text>
      </View>
    </View>
  );
}
