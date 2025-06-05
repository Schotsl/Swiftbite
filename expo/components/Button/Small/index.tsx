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
  shadow?: boolean;
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
  shadow = true,
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
        backgroundColor: variables.colors.background.secondary,
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
      borderWidth: variables.border.width,
      borderColor: "transparent",

      // color: variables.colors.text.secondary,
      // backgroundColor: variables.colors.background.secondary,

      color: variables.colors.white,
      backgroundColor: "#0076D6",
    };
  };

  const handleLayout = () => {
    if (!onPosition) {
      return;
    }

    requestAnimationFrame(() => {
      marker.current?.measureInWindow((x, y) => {
        onPosition({ x, y });
      });
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
              shadowColor: shadow ? "#000" : "transparent",
              shadowRadius: shadow ? 8 : 0,
              shadowOpacity: shadow ? 0.05 : 0,
              shadowOffset: shadow
                ? { width: 0, height: 2 }
                : { width: 0, height: 0 },

              // I added this background color to improve shadow performance
              alignSelf: title ? "flex-start" : "center",
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
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        style={{
          gap: variables.gap.small,
          minWidth: nano
            ? variables.heightButtonNano
            : variables.heightButtonSmall,
          minHeight: nano
            ? variables.heightButtonNano
            : variables.heightButtonSmall,

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
        {/* This has to be rendered before the text and icons so it stays in the background */}
        {isSecondary && <DecorativeLinear />}
        <DecorativeNoise />

        {icon && (
          <FontAwesome6 name={icon} size={nano ? 13 : 14} color={color} />
        )}

        {iconMaterial && (
          <MaterialIcons
            name={iconMaterial}
            size={nano ? 13 : 14}
            color={color}
          />
        )}

        {title && (
          <TextSmall style={{ marginTop: -1 }} color={color} weight="semibold">
            {title}
          </TextSmall>
        )}
      </TouchableOpacity>
    </View>
  );
}
