import { FontAwesome6, MaterialIcons } from "@expo/vector-icons";
import { useRef } from "react";
import {
  Text,
  View,
  ViewStyle,
  StyleProp,
  TouchableOpacity,
} from "react-native";

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
          backgroundColor: "#fff",
          paddingHorizontal: title ? 16 : 0,

          borderRadius: 100,
          borderColor: color || "#000",
          borderWidth: 2,
        },
        style,
      ]}
    >
      {icon && (
        <FontAwesome6
          name={icon}
          size={nano ? 12 : 14}
          color={color || "#000"}
        />
      )}

      {iconMaterial && (
        <MaterialIcons
          name={iconMaterial}
          size={nano ? 12 : 14}
          color={color || "#000"}
        />
      )}

      {title && (
        <Text
          style={{
            fontSize: 14,
            fontFamily: "OpenSans_600SemiBold",
            marginTop: -1,
          }}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}
