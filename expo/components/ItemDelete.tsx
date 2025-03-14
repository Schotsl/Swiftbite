import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import { TouchableOpacity, View } from "react-native";

type SwipeableItemDeleteProps = {
  onDelete: () => void;
};

export default function SwipeableItemDelete({
  onDelete,
}: SwipeableItemDeleteProps) {
  return (
    <View
      style={{
        height: "100%",
        backgroundColor: "#FF3B30",
      }}
    >
      <TouchableOpacity
        onPress={onDelete}
        style={{
          width: 75,
          right: 0,
          height: "100%",
          position: "absolute",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <FontAwesome name="trash" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}
