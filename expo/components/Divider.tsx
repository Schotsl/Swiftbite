import { View } from "react-native";

import TextBody from "@/components/Text/Body";

import variables from "@/variables";

export function Divider() {
  return (
    <View style={{ alignItems: "center" }}>
      <TextBody
        weight="semibold"
        style={{
          backgroundColor: variables.colors.white,
          paddingHorizontal: 8,
        }}
      >
        Of
      </TextBody>
      <View
        style={{
          top: "50%",
          width: "100%",
          height: 2,

          zIndex: -1,
          position: "absolute",
          backgroundColor: "#000",
        }}
      />
    </View>
  );
}
