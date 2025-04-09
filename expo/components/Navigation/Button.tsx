import Ionicons from "@expo/vector-icons/MaterialCommunityIcons";
import { useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";
import { Alert } from "react-native";
import { TouchableOpacity } from "react-native";

export default function NavigationButton() {
  const router = useRouter();

  const [permission, requestPermission] = useCameraPermissions();

  const handlePress = async () => {
    // Ask for camera permissions if not granted
    if (!permission?.granted) {
      const response = await requestPermission();

      if (!response.granted) {
        Alert.alert("Permission denied");
        return;
      }
    }

    // Navigate to the add screen
    router.push("/add");
    router.push("/add/add-overview");
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={{
        top: -32,
        left: "50%",
        width: 62,
        height: 62,
        position: "absolute",
        transform: [{ translateX: -32 }],
        backgroundColor: "blue",

        alignItems: "center",
        borderRadius: 50,
        justifyContent: "center",
      }}
    >
      <Ionicons name="plus" size={32} color="white" />
    </TouchableOpacity>
  );
}
