import language from "@/language";
import { Text, View } from "react-native";

export default function Stats() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text
        style={{
          fontSize: 16,
          fontFamily: "OpenSans_400Regular",
          maxWidth: 300,
          textAlign: "center",
        }}
      >
        {language.page.stats.empty}
      </Text>
    </View>
  );
}
