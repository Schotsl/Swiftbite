import { Text, View } from "react-native";

import SettingHeaderAvatar from "./Avatar";

export default function SettingHeader() {
  return (
    <View
      style={{
        gap: 12,
        alignItems: "center",
        flexDirection: "row",
      }}
    >
      <SettingHeaderAvatar />

      <View style={{ gap: 4 }}>
        <Text
          style={{
            fontSize: 20,
            fontFamily: "OpenSans_600SemiBold",
          }}
        >
          Sjors van Holst
        </Text>
        <Text
          style={{
            fontSize: 14,
            fontFamily: "OpenSans_400Regular",
          }}
        >
          184 maaltijden geregistreerd
        </Text>
      </View>
    </View>
  );
}
