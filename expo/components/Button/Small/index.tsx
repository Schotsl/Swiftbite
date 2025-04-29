import { FontAwesome6, MaterialIcons } from "@expo/vector-icons";
import { TouchableOpacity, StyleProp, ViewStyle } from "react-native";

type ButtonSmallBase = {
  nano?: boolean;
  color?: string;
  style?: StyleProp<ViewStyle>;
  onPress: () => void;
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
  onPress,
}: ButtonSmallProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        {
          width: nano ? 28 : 36,
          height: nano ? 28 : 36,

          alignItems: "center",
          justifyContent: "center",

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
          size={nano ? 12 : 16}
          color={color || "#000"}
        />
      )}

      {iconMaterial && (
        <MaterialIcons
          name={iconMaterial}
          size={nano ? 12 : 16}
          color={color || "#000"}
        />
      )}
    </TouchableOpacity>
  );
}
