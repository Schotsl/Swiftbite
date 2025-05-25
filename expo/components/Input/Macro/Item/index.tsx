import { View } from "react-native";

import TextSmall from "@/components/Text/Small";
import TextLarge from "@/components/Text/Large";
import ButtonSmall from "@/components/Button/Small";
import variables from "@/variables";

type InputMacroItemProps = {
  label: string;
  border: string;
  background: string;
  percentage: number;
  description: string;
  onPress: () => void;
};

export default function InputMacroItem({
  label,
  border,
  background,
  percentage,
  description,
  onPress,
}: InputMacroItemProps) {
  const percentageDisplay = percentage * 100;
  const percentageRounded = Math.round(percentageDisplay);

  return (
    <View
      style={{
        gap: variables.gap.normal,
        alignItems: "flex-end",
        flexDirection: "row",
      }}
    >
      <View style={{ flex: 1, gap: 4 }}>
        <TextLarge weight="semibold">{label}</TextLarge>

        <TextSmall>{description}</TextSmall>
      </View>

      <View
        style={{
          width: 86,
          height: 86,
          borderColor: border,
          borderWidth: 2,
          backgroundColor: background,
          borderRadius: 43,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <TextLarge color="#FFF" weight="semibold">
          {percentageRounded}%
        </TextLarge>

        <ButtonSmall
          icon="pencil"
          onPress={onPress}
          nano
          style={{
            left: -4,
            bottom: -4,
            position: "absolute",
          }}
        />
      </View>
    </View>
  );
}
