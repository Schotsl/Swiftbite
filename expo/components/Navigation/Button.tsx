import Ionicons from "@expo/vector-icons/MaterialCommunityIcons";
import { useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";
import { Alert, View } from "react-native";
import { TouchableOpacity } from "react-native";
import Button from "../Button";
import { useState } from "react";

export default function NavigationButton() {
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);

  const [permission, requestPermission] = useCameraPermissions();

  const handlePress = async () => {
    setIsOpen(!isOpen);
  };

  const handleSearch = () => {
    setIsOpen(false);

    router.push("/add/add-text");
  };

  const handleManual = () => {
    setIsOpen(false);
  };

  const handleEstimate = () => {
    setIsOpen(false);
  };

  const handleCamera = async () => {
    setIsOpen(false);
    // Ask for camera permissions if not granted
    if (!permission?.granted) {
      const response = await requestPermission();

      if (!response.granted) {
        Alert.alert("Permission denied");
        return;
      }
    }

    router.push("/add/add-ai");
  };

  return (
    <View>
      {isOpen && (
        <View
          style={{
            width: 175,
            position: "absolute",
            bottom: 71,
            left: "50%",
            gap: 16,
            transform: [{ translateX: -87.5 }],
          }}
        >
          <Button
            onPress={handleManual}
            icon="rectangle-list"
            title="Handmatig"
          />

          <Button
            onPress={handleEstimate}
            icon="wand-magic-sparkles"
            title="Inschatting"
          />

          <Button
            onPress={handleSearch}
            icon="magnifying-glass"
            title="Zoeken"
          />

          <Button onPress={handleCamera} icon="camera" title="Camera" />
        </View>
      )}
      <View
        style={{
          top: -49,
          left: "50%",
          position: "absolute",
          transform: [{ translateX: -32 }, { rotate: "45deg" }],

          borderWidth: 2,
          borderColor: "#000",
          borderRadius: 100,

          borderTopColor: "transparent",
          borderLeftColor: "transparent",
        }}
      >
        <View
          style={{
            borderWidth: 4,
            borderColor: "#fff",
            borderRadius: 100,

            borderTopColor: "transparent",
            borderLeftColor: "transparent",
          }}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={handlePress}
            style={{
              width: 62,
              height: 62,
              transform: [{ rotate: "45deg" }],

              borderWidth: 2,
              borderColor: "#000",
              borderRadius: 100,

              backgroundColor: "#fff",

              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {isOpen ? (
              <Ionicons name="close" size={28} color="#000" />
            ) : (
              <Ionicons name="plus" size={28} color="#000" />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
