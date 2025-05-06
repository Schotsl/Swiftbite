import { useRouter } from "expo-router";
import { Alert, View } from "react-native";
import { useCameraPermission } from "react-native-vision-camera";

import Button from "@/components/Button";

type NavigationAddListProps = {
  onClose: () => void;
};

export default function NavigationAddList({ onClose }: NavigationAddListProps) {
  const router = useRouter();

  const { hasPermission, requestPermission } = useCameraPermission();

  const handleSearch = () => {
    onClose();

    router.push("/add/add-search");
  };

  const handleManual = () => {
    onClose();
  };

  const handleEstimate = () => {
    onClose();

    router.push("/add/add-estimation");
  };

  const handleCamera = async () => {
    // Ask for camera permissions if not granted
    if (!hasPermission) {
      const response = await requestPermission();

      if (!response) {
        Alert.alert("Je hebt geen toegang verleend voor de camera");

        return;
      }
    }

    onClose();

    router.push("/camera");
  };

  return (
    <View
      style={{
        gap: 16,
        left: "50%",
        width: 175,
        bottom: 110,
        position: "absolute",
        transform: [{ translateX: -87.5 }],
      }}
    >
      <Button icon="camera" title="Camera" onPress={handleCamera} />

      <Button icon="magnifying-glass" title="Zoeken" onPress={handleSearch} />

      <Button
        icon="wand-magic-sparkles"
        title="Inschatting"
        onPress={handleEstimate}
      />
    </View>
  );
}
