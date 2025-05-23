import TextBody from "@/components/Text/Body";

import variables from "@/variables";

import { View, StyleProp, ViewStyle, TouchableOpacity } from "react-native";

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
              backgroundColor: variables.colors.text.primary,
              borderRadius: 4,
            }}
          />
        )}
      </View>

      <TextBody weight="semibold">{label}</TextBody>
    </TouchableOpacity>
  );
}
