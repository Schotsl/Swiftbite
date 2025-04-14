import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import { TouchableOpacity, View } from "react-native";

type ItemDeleteProps = {
  border?: boolean;
  onDelete: () => void;
};

export default function ItemDelete({
  border = false,
  onDelete,
}: ItemDeleteProps) {
  return (
    <View
      style={{
        height: 75,
        backgroundColor: "#ffb9b5",
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

          borderWidth: border ? 2 : 0,
          borderColor: "#000000",
          borderTopWidth: 0,
          borderLeftWidth: 0,
          borderRightWidth: 0,
        }}
      >
        <FontAwesome name="trash" size={24} color="#000" />
      </TouchableOpacity>
    </View>
  );
}
