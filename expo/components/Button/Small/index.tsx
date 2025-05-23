import TextSmall from "@/components/Text/Small";
import DecorativeNoise from "@/components/Decorative/Noise";

import variables from "@/variables";

import { useRef } from "react";
import { FontAwesome6, MaterialIcons } from "@expo/vector-icons";
import { View, ViewStyle, StyleProp, TouchableOpacity } from "react-native";

type ButtonSmallBase = {
  nano?: boolean;
  color?: string;
  style?: StyleProp<ViewStyle>;
  title?: string;
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
  color,
  style,
  title,
  onPress,
  onPosition,
}: ButtonSmallProps) {
  const handleLayout = () => {
    if (!marker.current) {
      return;
    }

    if (!onPosition) {
      return;
    }

    marker.current.measure((x, y, width, height, pageX, pageY) => {
      onPosition({ x: pageX, y: pageY });
    });
  };

  const marker = useRef<View>(null);
  return (
    <TouchableOpacity
      ref={marker}
      onPress={onPress}
      onLayout={handleLayout}
      style={[
        {
          gap: 8,
          minWidth: nano ? 28 : 36,
          minHeight: nano ? 28 : 36,

          alignSelf: "flex-start",
          alignItems: "center",
          flexDirection: "row",
          justifyContent: "center",
          paddingHorizontal: title ? 16 : 0,
          backgroundColor: variables.colors.background.secondary,
          overflow: "hidden",

          borderRadius: 100,
        },
        style,
      ]}
    >
      {icon && (
        <FontAwesome6
          name={icon}
          size={nano ? 12 : 14}
          color={color || variables.colors.text.secondary}
        />
      )}

      {iconMaterial && (
        <MaterialIcons
          name={iconMaterial}
          size={nano ? 12 : 14}
          color={color || variables.colors.text.secondary}
        />
      )}

      {title && (
        <TextSmall
          style={{ marginTop: -1 }}
          color={variables.colors.text.secondary}
          weight="semibold"
        >
          {title}
        </TextSmall>
      )}

      <DecorativeNoise />
    </TouchableOpacity>
  );
}
