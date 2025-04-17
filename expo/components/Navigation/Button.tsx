import Ionicons from "@expo/vector-icons/MaterialCommunityIcons";
import { useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";
import { Alert, Modal, View } from "react-native";
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
      <Modal
        visible={isOpen}
        transparent={true}
        animationType="none"
        onRequestClose={() => setIsOpen(false)}
      >
        <View style={{ flex: 1, backgroundColor: "rgba(0, 0, 0, 0.75)" }} />

        <View
          style={{
            width: 175,
            position: "absolute",
            bottom: 142,
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

        <View
          style={{
            bottom: 46,
            left: "50%",
            position: "absolute",
            transform: [{ translateX: -32 }],
          }}
        >
          <NavigationButtonInner
            open={isOpen}
            background={false}
            onPress={handlePress}
          />
        </View>
      </Modal>

      <View
        style={{
          top: -49,
          left: "50%",
          position: "absolute",
          transform: [{ translateX: -32 }],
        }}
      >
        <NavigationButtonInner open={isOpen} onPress={handlePress} />
      </View>
    </View>
  );
}

type NavigationButtonInnerProps = {
  open: boolean;
  background?: boolean;
  onPress: () => void;
};

function NavigationButtonInner({
  open,
  background = true,
  onPress,
}: NavigationButtonInnerProps) {
  return (
    <View
      style={{
        transform: [{ rotate: "45deg" }],

        borderWidth: 2,
        borderColor: background ? "#000" : "transparent",
        borderRadius: 100,

        borderTopColor: "transparent",
        borderLeftColor: "transparent",
      }}
    >
      <View
        style={{
          borderWidth: 4,
          borderColor: background ? "#fff" : "transparent",
          borderRadius: 100,

          borderTopColor: "transparent",
          borderLeftColor: "transparent",
        }}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={onPress}
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
          {open ? (
            <Ionicons name="close" size={28} color="#000" />
          ) : (
            <Ionicons name="plus" size={28} color="#000" />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
