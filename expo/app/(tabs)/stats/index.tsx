import { Text, View } from "react-native";

export default function Tab() {
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
        This page is under construction and won't be around for a while 👷
      </Text>
    </View>
  );
}
