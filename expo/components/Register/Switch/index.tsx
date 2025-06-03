import variables from "@/variables";

import { View } from "react-native";

export default function RegisterSwitch() {
  return (
    <View
      style={{
        top: "50%",
        left: "50%",
        width: 52,
        height: 30,
        padding: 2,
        position: "absolute",
        transform: [{ translateX: -26 }, { translateY: -15 }],

        flexDirection: "row-reverse",

        borderRadius: 100,
        borderColor: variables.border.color,
        borderWidth: 2,
      }}
    >
      <View
        style={{
          width: 22,
          height: 22,
          borderRadius: 11,
          backgroundColor: variables.colors.text.secondary,
        }}
      />
    </View>
  );
}
