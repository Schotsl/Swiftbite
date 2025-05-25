import TextSmall from "@/components/Text/Small";
import DecorativeNoise from "@/components/Decorative/Noise";
import DecorativeLinear from "@/components/Decorative/Linear";

import variables from "@/variables";

import { useRef } from "react";
import { FontAwesome6, MaterialIcons } from "@expo/vector-icons";
import { View, ViewStyle, StyleProp, TouchableOpacity } from "react-native";

type ButtonSmallBase = {
  nano?: boolean;
  color?: string;
  style?: StyleProp<ViewStyle>;
  title?: string;
  gradient?: boolean;
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
  color: colorProp,
  style,
  title,
  gradient = false,
  onPress,
  onPosition,
}: ButtonSmallProps) {
  let color = variables.colors.text.secondary;

  if (gradient) {
    color = variables.colors.white;
  }

  if (colorProp) {
    color = colorProp;
  }

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
    <View
      style={[
        {
          shadowColor: "#000",
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.05,
        },
        style,
      ]}
    >
      <TouchableOpacity
        ref={marker}
        onPress={onPress}
        onLayout={handleLayout}
        style={{
          gap: variables.gap.small,
          minWidth: nano ? 28 : 36,
          minHeight: nano ? 28 : 36,

          alignSelf: "flex-start",
          alignItems: "center",
          flexDirection: "row",
          justifyContent: "center",
          paddingHorizontal: title ? 16 : 0,

          overflow: "hidden",

          // borderColor: "#c9e6ff",
          // borderWidth: 2,
          borderRadius: 100,
          backgroundColor: variables.colors.background.secondary,
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

        {gradient && <DecorativeLinear />}

        <DecorativeNoise />
      </TouchableOpacity>
    </View>
  );
}
