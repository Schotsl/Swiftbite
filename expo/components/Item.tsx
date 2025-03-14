import { Image } from "expo-image";
import { useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";

import { EntryWithIngredient } from "@/types";

export default function Item({
  consumed_quantity,
  consumed_unit,
  ingredient,
}: EntryWithIngredient) {
  const [loadedImage, setLoadedImage] = useState(false);
  const loadedData = ingredient.calorie_100g && consumed_quantity;

  const calories = loadedData
    ? Math.round((ingredient.calorie_100g! * consumed_quantity) / 100)
    : null;

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
      <View
        style={{
          width: 42,
          height: 42,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {ingredient.icon_id && (
          <Image
            source={`https://ffbbrrfdghbvuajheulg.supabase.co/storage/v1/object/public/icon/${ingredient.icon_id}`}
            onLoad={() => setLoadedImage(true)}
            contentFit="contain"
            contentPosition="center"
            style={{
              width: 42,
              zIndex: 1,
              height: 42,
              position: "absolute",
            }}
          />
        )}

        {!loadedImage && <ActivityIndicator size="small" />}
      </View>

      <View style={{ gap: 6, flex: 1 }}>
        <Text style={{ fontSize: 16 }}>
          {ingredient.title ? ingredient.title : "Loading..."}
        </Text>

        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={{ fontSize: 14 }}>
            {loadedData ? `${calories} kcal` : "Loading..."}
          </Text>

          <Text style={{ fontSize: 14, color: "#666" }}>
            {consumed_quantity ? consumed_quantity : "Loading..."}{" "}
            {consumed_unit}
          </Text>
        </View>
      </View>
    </View>
  );
}
