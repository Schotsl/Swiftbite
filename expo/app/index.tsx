import { Alert, Button, Text, View } from "react-native";
import { useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";

export default function Index() {
  const router = useRouter();

  const [permission, requestPermission] = useCameraPermissions();

  const handleScan = async () => {
    // Ask for camera permissions if not granted
    if (!permission?.granted) {
      const response = await requestPermission();

      if (!response.granted) {
        Alert.alert("Permission denied");
        return;
      }
    }

    // Navigate to the scan screen
    router.push("/scan");
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Edit app/index.tsx to edit this screen.</Text>

      <Button title="Scan QR Code" onPress={handleScan} />
    </View>
  );
}
