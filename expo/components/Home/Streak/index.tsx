import { FontAwesome6 } from "@expo/vector-icons";
import { View, Text } from "react-native";

export default function HomeStreak() {
  return (
    <View
      style={{
        gap: 8,
        alignItems: "center",
        flexDirection: "row",

        paddingHorizontal: 16,
        paddingVertical: 8,

        borderWidth: 2,
        borderColor: "#000000",
        borderRadius: 100,
      }}
    >
      <FontAwesome6 name="fire" size={16} color="#000000" />
      <Text style={{ fontSize: 16, fontFamily: "OpenSans_600SemiBold" }}>
        11
      </Text>
    </View>
  );
}
