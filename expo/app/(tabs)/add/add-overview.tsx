import { useRouter } from "expo-router";
import { Text, View } from "react-native";

import Button from "@/components/Button";

export default function AddScreen() {
  const router = useRouter();

  return (
    <View
      style={{
        gap: 16,
        flex: 1,
        padding: 32,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#FFFFFF",
      }}
    >
      <Text
        style={{
          fontSize: 20,
          fontWeight: "bold",
          paddingBottom: 16,
        }}
      >
        Choose Scanning Method
      </Text>

      <Button
        title="Scan with AI"
        icon="scan"
        onPress={() => router.push("/add/add-ai")}
      />

      <Button
        title="Scan with Barcode"
        icon="barcode"
        onPress={() => router.push("/add/add-barcode")}
      />

      <Button
        title="Search with Text"
        icon="search"
        onPress={() => router.push("/add/add-text")}
      />
    </View>
  );
}
