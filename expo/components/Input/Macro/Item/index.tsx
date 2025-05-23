import { View } from "react-native";

import ButtonSmall from "@/components/Button/Small";
import TextTitle from "@/components/Text/Title";
import TextSmall from "@/components/Text/Small";
import TextLarge from "@/components/Text/Large";

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
        <TextLarge>{label}</TextLarge>

        <TextSmall>{description}</TextSmall>
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
        <TextTitle style={{ marginTop: -2 }}>{percentageRounded}%</TextTitle>

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
