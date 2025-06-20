import React, { Fragment } from "react";

import { FontAwesome6 } from "@expo/vector-icons";
import {
  StyleProp,
  ViewStyle,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

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
    // textColor = variables.colors.text.primary;
    // backgroundColorToSet = variables.colors.background.secondary;

    textColor = variables.colors.white;
    backgroundColorToSet = "#0076D6";
  }

  if (action === "delete") {
    textColor = variables.colors.primary;
    backgroundColorToSet = variables.colors.primaryLight;
  }

  if (action === "tertiary") {
    textColor = variables.colors.text.primary;
    backgroundColorToSet = variables.colors.greyBackground;
  }

  if (action === "primary") {
    backgroundColorToSet = variables.colors.transparent;
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        {
          gap: variables.gap.small,
          width: "100%",
          height: variables.heightButton,
          opacity: disabled || loading ? variables.input.disabled.opacity : 1,

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

      {action === "delete" && <DecorativeNoise />}

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
