import { Image } from "expo-image";
import { useState } from "react";
import { ActivityIndicator } from "react-native";
import { Text, View } from "react-native";

import { Ingredient } from "@/types";

export default function Item({ calorie_100g, title, icon_id }: Ingredient) {
  const [loaded, setLoaded] = useState(false);

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
        {icon_id && (
          <Image
            source={`https://ffbbrrfdghbvuajheulg.supabase.co/storage/v1/object/public/icon/${icon_id}`}
            onLoad={() => setLoaded(true)}
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

        {!loaded && <ActivityIndicator size="small" />}
      </View>

      <View style={{ gap: 6 }}>
        <Text style={{ fontSize: 16 }}>{title ? title : "Loading..."}</Text>
        <Text style={{ fontSize: 14 }}>
          {calorie_100g ? calorie_100g : "Loading..."} kcal
        </Text>
      </View>
    </View>
  );
}
