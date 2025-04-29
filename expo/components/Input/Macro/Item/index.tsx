import { View, Text } from "react-native";

import ButtonSmall from "@/components/Button/Small";

type InputMacroItemProps = {
  label: string;
  percentage: number;
  description: string;
  onPress: () => void;
};

export default function InputMacroItem({
  label,
  percentage,
  description,
  onPress,
}: InputMacroItemProps) {
  const percentageDisplay = percentage * 100;
  const percentageRounded = Math.round(percentageDisplay);

  return (
    <View style={{ flexDirection: "row", gap: 16, alignItems: "flex-end" }}>
      <View style={{ flex: 1, gap: 4 }}>
        <Text
          style={{
            fontSize: 22,
            fontFamily: "OpenSans_600SemiBold",
          }}
        >
          {label}
        </Text>
        <Text
          style={{
            fontSize: 14,
            fontFamily: "OpenSans_400Regular",
          }}
        >
          {description}
        </Text>
      </View>

      <View
        style={{
          width: 86,
          height: 86,
          borderWidth: 4,
          borderColor: "#000",
          borderRadius: 43,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text
          style={{
            marginTop: -2,
            fontSize: 22,
            fontFamily: "OpenSans_600SemiBold",
          }}
        >
          {percentageRounded}%
        </Text>

        <ButtonSmall
          icon="pencil"
          onPress={onPress}
          nano
          style={{
            left: -4,
            bottom: -4,
            position: "absolute",
            backgroundColor: "#fff",
          }}
        />
      </View>
    </View>
  );
}
