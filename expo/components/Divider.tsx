import { Text, View } from "react-native";

export function Divider() {
  return (
    <View style={{ alignItems: "center" }}>
      <Text
        style={{
          backgroundColor: "#fff",
          paddingHorizontal: 8,

          fontSize: 16,
          fontWeight: "semibold",
        }}
      >
        Of
      </Text>
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
