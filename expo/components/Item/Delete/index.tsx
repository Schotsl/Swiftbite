import React from "react";

import { FontAwesome } from "@expo/vector-icons";
import { TouchableOpacity, View } from "react-native";
import variables from "@/variables";

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
        }}
      >
        <FontAwesome
          name="trash"
          size={24}
          color={variables.colors.text.primary}
        />
      </TouchableOpacity>
    </View>
  );
}
