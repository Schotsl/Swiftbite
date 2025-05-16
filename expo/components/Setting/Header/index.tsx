import { useQuery } from "@tanstack/react-query";
import { Text, View } from "react-native";

import userData from "@/queries/userData";
import SettingHeaderAvatar from "./Avatar";
import { useIsFocused } from "@react-navigation/native";

export default function SettingHeader() {
  const focus = useIsFocused();

  const { data } = useQuery({
    ...userData(),
    enabled: focus,
  });

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
          {data?.first_name} {data?.last_name}
        </Text>
        <Text
          style={{
            fontSize: 14,
            fontFamily: "OpenSans_400Regular",
          }}
        >
          {data?.total} entries geregistreerd
        </Text>
      </View>
    </View>
  );
}
