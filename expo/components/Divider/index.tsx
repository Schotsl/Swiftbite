import { View } from "react-native";

import variables from "@/variables";
import language from "@/language";

import TextSmall from "../Text/Small";

type DividerProps = {
  label?: string;
};

export default function Divider({ label }: DividerProps) {
  return (
    <View style={{ alignItems: "center" }}>
      <TextSmall
        weight="semibold"
        style={{
          backgroundColor: variables.colors.white,
          paddingHorizontal: variables.gap.small,
        }}
      >
        {label || language.components.divider.or}
      </TextSmall>
      <View
        style={{
          top: "50%",
          width: "100%",
          height: variables.border.width,

          zIndex: -1,
          position: "absolute",
          backgroundColor: variables.border.color,
        }}
      />
    </View>
  );
}
