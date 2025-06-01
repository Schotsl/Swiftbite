import { View } from "react-native";

import variables from "@/variables";
import language from "@/language";

import TextSmall from "../Text/Small";

export default function Divider() {
  return (
    <View style={{ alignItems: "center" }}>
      <TextSmall
        weight="semibold"
        style={{
          backgroundColor: variables.colors.white,
          paddingHorizontal: variables.gap.small,
        }}
      >
        {language.components.divider.or}
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
