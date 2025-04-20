import { FontAwesome6, MaterialIcons } from "@expo/vector-icons";
import { TouchableOpacity, StyleProp, ViewStyle } from "react-native";

type ButtonSmallBase = {
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
  icon,
  iconMaterial,
  style,
  onPress,
}: ButtonSmallProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        {
          width: 36,
          height: 36,

          alignItems: "center",
          justifyContent: "center",

          borderRadius: 100,
          borderColor: "#000",
          borderWidth: 2,
        },
        style,
      ]}
    >
      {icon && <FontAwesome6 name={icon} size={16} color="black" />}

      {iconMaterial && (
        <MaterialIcons name={iconMaterial} size={18} color="black" />
      )}
    </TouchableOpacity>
  );
}
