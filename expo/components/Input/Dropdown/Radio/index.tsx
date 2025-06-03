import TextBody from "@/components/Text/Body";
import TextSmall from "@/components/Text/Small";

import variables from "@/variables";

import { View, StyleProp, ViewStyle, TouchableOpacity } from "react-native";

export type InputDropdownRadioProps = {
  style?: StyleProp<ViewStyle>;
  subtitle?: string;

  label: string;
  selected: boolean;
  onSelect: () => void;
};

export default function InputDropdownRadio({
  style,
  subtitle,

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
          borderColor: variables.border.color,
          borderWidth: variables.border.width,
          borderRadius: variables.border.radius,

          // I would use the border width variable but the decimal causes a visual glitch
          borderTopWidth: 2,
          borderBottomWidth: 2,

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
          borderRadius: variables.border.radius,

          alignItems: "center",
          justifyContent: "center",

          alignSelf: subtitle ? "flex-start" : "center",
          marginTop: subtitle ? 4 : 0,
        }}
      >
        {selected && (
          <View
            style={{
              width: variables.border.radius,
              height: variables.border.radius,
              borderRadius: variables.border.radius,
              backgroundColor: variables.colors.text.secondary,
            }}
          />
        )}
      </View>

      <View>
        <TextBody weight="semibold">{label}</TextBody>

        {subtitle && <TextSmall>{subtitle}</TextSmall>}
      </View>
    </TouchableOpacity>
  );
}
