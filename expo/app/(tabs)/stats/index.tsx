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
        Deze pagina is nog in ontwikkeling, we zien je later graag terug! 👷
      </Text>
    </View>
  );
}
