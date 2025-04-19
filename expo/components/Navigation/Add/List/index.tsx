import { useRouter } from "expo-router";
import { Alert, View } from "react-native";
import { useCameraPermissions } from "expo-camera";

import Button from "@/components/Button";

type NavigationAddListProps = {
  onClose: () => void;
};

export default function NavigationAddList({ onClose }: NavigationAddListProps) {
  const router = useRouter();

  const [permission, requestPermission] = useCameraPermissions();

  const handleSearch = () => {
    onClose();

    router.push("/add/add-text");
  };

  const handleManual = () => {
    onClose();
  };

  const handleEstimate = () => {
    onClose();
  };

  const handleCamera = async () => {
    // Ask for camera permissions if not granted
    if (!permission?.granted) {
      const response = await requestPermission();

      if (!response.granted) {
        Alert.alert("Permission denied");

        return;
      }
    }

    onClose();

    router.push("/add/add-camera");
  };

  return (
    <View
      style={{
        gap: 16,
        left: "50%",
        width: 175,
        bottom: 142,
        position: "absolute",
        transform: [{ translateX: -87.5 }],
      }}
    >
      <Button icon="rectangle-list" title="Handmatig" onPress={handleManual} />

      <Button
        icon="wand-magic-sparkles"
        title="Inschatting"
        onPress={handleEstimate}
      />

      <Button icon="magnifying-glass" title="Zoeken" onPress={handleSearch} />

      <Button icon="camera" title="Camera" onPress={handleCamera} />
    </View>
  );
}
