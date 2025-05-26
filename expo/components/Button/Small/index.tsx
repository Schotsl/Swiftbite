import TextSmall from "@/components/Text/Small";
import DecorativeNoise from "@/components/Decorative/Noise";
import DecorativeLinear from "@/components/Decorative/Linear";

import variables from "@/variables";

import { useRef } from "react";
import { FontAwesome6, MaterialIcons } from "@expo/vector-icons";
import { View, ViewStyle, StyleProp, TouchableOpacity } from "react-native";

type ButtonSmallBase = {
  nano?: boolean;
  style?: StyleProp<ViewStyle>;
  title?: string;
  action?: "primary" | "secondary" | "tertiary";
  disabled?: boolean;
  onPress: () => void;
  onPosition?: (position: { x: number; y: number }) => void;
};

type ButtonSmallFontAwesomeProps = ButtonSmallBase & {
  icon: keyof typeof FontAwesome6.glyphMap;
  iconMaterial?: never;
};

type ButtonSmallMaterialIconProps = ButtonSmallBase & {
  icon?: never;
  iconMaterial: keyof typeof MaterialIcons.glyphMap;
};

export type ButtonSmallProps =
  | ButtonSmallFontAwesomeProps
  | ButtonSmallMaterialIconProps;

export default function ButtonSmall({
  nano = false,
  icon,
  iconMaterial,

  style,
  title,
  action = "primary",
  disabled = false,
  onPress,
  onPosition,
}: ButtonSmallProps) {
  const isSecondary = action === "secondary";
  const isTertiary = action === "tertiary";

  const getStyle = (action: "primary" | "secondary" | "tertiary") => {
    if (action === "secondary") {
      return {
        color: variables.colors.white,
        borderWidth: 0,
        borderColor: "transparent",
        backgroundColor: "transparent",
      };
    }

    if (action === "tertiary") {
      return {
        color: variables.colors.white,
        borderWidth: variables.border.width,
        borderColor: variables.colors.white,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
      };
    }

    return {
      color: variables.colors.text.secondary,
      borderWidth: variables.border.width,
      borderColor: "transparent",
      backgroundColor: variables.colors.background.secondary,
    };
  };

  const handleLayout = () => {
    if (!onPosition) {
      return;
    }

    marker.current?.measureInWindow((x, y) => {
      onPosition({ x, y });
    });
  };

  const marker = useRef<View>(null);

  const { backgroundColor, borderColor, borderWidth, color } = getStyle(action);

  return (
    <View
      style={[
        isTertiary
          ? {}
          : {
              shadowColor: "#000",
              shadowRadius: 8,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.05,

              // I added this background color to improve shadow performance
              alignSelf: "flex-start",
              borderRadius: 100,
              backgroundColor: variables.colors.white,
            },
        style,
      ]}
    >
      <TouchableOpacity
        ref={marker}
        onPress={onPress}
        onLayout={handleLayout}
        disabled={disabled}
        style={{
          gap: variables.gap.small,
          minWidth: nano ? 28 : 36,
          minHeight: nano ? 28 : 36,

          alignItems: "center",
          flexDirection: "row",
          justifyContent: "center",
          paddingHorizontal: title ? 16 : 0,

          overflow: "hidden",
          borderRadius: 100,
          borderColor,
          borderWidth,
          backgroundColor,

          opacity: disabled ? variables.input.disabled.opacity : 1,
        }}
      >
        {icon && (
          <FontAwesome6 name={icon} size={nano ? 12 : 14} color={color} />
        )}

        {iconMaterial && (
          <MaterialIcons
            name={iconMaterial}
            size={nano ? 12 : 14}
            color={color}
          />
        )}

        {title && (
          <TextSmall style={{ marginTop: -1 }} color={color} weight="semibold">
            {title}
          </TextSmall>
        )}

        {isSecondary && <DecorativeLinear />}

        <DecorativeNoise />
      </TouchableOpacity>
    </View>
  );
}
