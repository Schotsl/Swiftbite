import { FontAwesome6 } from "@expo/vector-icons";
import { Fragment } from "react";
import {
  StyleProp,
  ViewStyle,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

import React from "react";
import TextBody from "@/components/Text/Body";
import variables from "@/variables";
import DecorativeNoise from "@/components/Decorative/Noise";
import DecorativeLinear from "@/components/Decorative/Linear";

export type ButtonProps = {
  onPress: () => void;

  icon?: keyof typeof FontAwesome6.glyphMap;
  style?: StyleProp<ViewStyle>;
  title: string;
  action?: "primary" | "secondary" | "tertiary" | "delete";
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
  let textColor = variables.colors.white;
  let backgroundColorToSet = variables.colors.primary;

  if (action === "secondary") {
    textColor = variables.colors.text.primary;
    backgroundColorToSet = variables.colors.background.secondary;
  }

  if (action === "delete") {
    textColor = variables.colors.primary;
    backgroundColorToSet = variables.colors.primaryLight;
  }

  if (action === "tertiary") {
    textColor = variables.colors.text.primary;
    backgroundColorToSet = variables.colors.greyLight;
  }

  if (action === "primary") {
    backgroundColorToSet = "transparent";
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

          overflow: "hidden",
          borderRadius: 32,
          paddingVertical: 14,
          paddingHorizontal: 32,
          backgroundColor: backgroundColorToSet,
        },
        style,
      ]}
    >
      {action === "primary" && (
        <Fragment>
          <DecorativeLinear />
          <DecorativeNoise />
        </Fragment>
      )}
      {loading ? (
        <ActivityIndicator
          size="small"
          color={textColor}
          style={{ transform: [variables.scale], zIndex: 1 }}
        />
      ) : (
        icon && (
          <FontAwesome6
            name={icon}
            size={18}
            color={textColor}
            style={{ zIndex: 1 }}
          />
        )
      )}

      <TextBody
        color={textColor}
        align="center"
        weight="semibold"
        style={{ zIndex: 1 }}
      >
        {title}
      </TextBody>
    </TouchableOpacity>
  );
}
