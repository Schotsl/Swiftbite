import { Text, View } from "react-native";

export default function SettingHeader() {
  return (
    <View
      style={{
        gap: 12,
        alignItems: "center",
        flexDirection: "row",
      }}
    >
      <View
        style={{
          width: 48,
          height: 48,
          borderColor: "#000",
          borderWidth: 2,
          borderRadius: 24,
        }}
      />

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
