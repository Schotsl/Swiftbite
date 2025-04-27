import { Text, View } from "react-native";
import { useQuery } from "@tanstack/react-query";

import SettingHeaderAvatar from "./Avatar";
import userData from "@/queries/userData";

export default function SettingHeader() {
  const { data } = useQuery(userData());

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
          184 maaltijden geregistreerd
        </Text>
      </View>
    </View>
  );
}
