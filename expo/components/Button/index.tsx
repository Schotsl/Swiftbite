import { FontAwesome6 } from "@expo/vector-icons";
import {
  StyleProp,
  ViewStyle,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

import React from "react";
import TextBody from "../Text/Body";
import variables from "@/variables";

export type ButtonProps = {
  onPress: () => void;

  icon?: keyof typeof FontAwesome6.glyphMap;
  style?: StyleProp<ViewStyle>;
  title: string;
  action?: "primary" | "secondary" | "delete";
  loading?: boolean;
  disabled?: boolean;
};

export default function Button({
  onPress,

  icon,
  style,
  title,
  action = "primary",
  loading = false,
  disabled = false,
}: ButtonProps) {
  let color = variables.colors.white;
  let background = variables.colors.primary;

  if (action === "secondary") {
    color = variables.colors.text.primary;
    background = variables.colors.greyLight;
  }

  if (action === "delete") {
    color = variables.colors.primary;
    background = variables.colors.primaryLight;
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        {
          gap: variables.gap.small,
          width: "100%",
          opacity: disabled || loading ? 0.5 : 1,

          alignItems: "center",
          flexDirection: "row",
          justifyContent: "center",

          borderColor: variables.colors.grey,
          borderWidth: 1,

          borderRadius: 32,
          paddingVertical: 14,
          paddingHorizontal: 32,
          backgroundColor: background,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={color}
          style={{ transform: [variables.scale] }}
        />
      ) : (
        <FontAwesome6 name={icon} size={18} color={color} />
      )}

      <TextBody color={color} align="center" weight="semibold">
        {title}
      </TextBody>
    </TouchableOpacity>
  );
}
