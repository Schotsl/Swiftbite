import TextBody from "@/components/Text/Body";
import TextSmall from "@/components/Text/Small";

import { View } from "react-native";

type HomeMacrosProgressLabelProps = {
  value: number;
  label: string;
};

export default function HomeMacrosProgressLabel({
  value,
  label,
}: HomeMacrosProgressLabelProps) {
  return (
    <View
      style={{
        width: 96,
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <TextBody weight="semibold">{value}</TextBody>
      <TextSmall>{label}</TextSmall>
    </View>
  );
}
