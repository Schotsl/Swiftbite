import variables from "@/variables";
import {
  View,
  Text,
  StyleProp,
  ViewStyle,
  TouchableOpacity,
} from "react-native";

export type InputDropdownRadioProps = {
  style?: StyleProp<ViewStyle>;
  label: string;
  selected: boolean;
  onSelect: () => void;
};

export default function InputDropdownRadio({
  style,
  label,
  selected,

  onSelect,
}: InputDropdownRadioProps) {
  return (
    <TouchableOpacity
      style={[
        {
          gap: 12,
          padding: 16,
          paddingVertical: 12,
          borderRadius: 8,
          borderColor: variables.border.color,
          borderWidth: variables.border.width,

          flexDirection: "row",
          alignItems: "center",
        },
        style,
      ]}
      onPress={onSelect}
    >
      <View
        style={{
          width: 16,
          height: 16,
          borderColor: variables.border.color,
          borderWidth: variables.border.width,
          borderRadius: 8,

          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {selected && (
          <View
            style={{
              width: 8,
              height: 8,
              backgroundColor: "#000",
              borderRadius: 4,
            }}
          />
        )}
      </View>
      <Text
        style={{
          fontSize: 16,
          fontFamily: "OpenSans_600SemiBold",
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}
