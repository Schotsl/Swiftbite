import CameraControls from "@/components/Camera/Controls";
import CameraSelector from "@/components/Camera/Selector";
import CameraShortcuts from "@/components/Camera/Shortcuts";

import { useIsFocused } from "@react-navigation/native";
import { CameraType, CameraView } from "expo-camera";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";

export default function AddAI() {
  const focus = useIsFocused();
  const router = useRouter();
  const camera = useRef<CameraView>(null);

  const [facing, setFacing] = useState<CameraType>("back");

  function flipImage() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  const takeImage = async () => {
    if (!camera.current) {
      return;
    }

    console.log("[DEVICE] Taking picture...");

    const picture = await camera.current.takePictureAsync({
      skipProcessing: true,
      base64: true,
    });

    if (!picture) {
      return;
    }

    const { uri, width, height } = picture;

    router.push({
      pathname: "/add/add-preview",
      params: { uri, width, height },
    });
  };

  // Reset the page's state when is the screen is unfocused
  useEffect(() => {
    if (focus) {
      return;
    }

    setFacing("back");
  }, [focus]);

  if (!focus) {
    return null;
  }

  return (
    <View style={styles.container}>
      <CameraView
        ref={camera}
        facing={facing}
        style={{
          gap: 24,
          flex: 1,
          paddingBottom: 64,
        }}
      >
        <CameraShortcuts />

        <CameraSelector />

        <CameraControls onFlip={flipImage} onTake={takeImage} />
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  controls: {
    flex: 1,
    margin: 64,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  button: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 15,
    borderRadius: 10,
    minWidth: 120,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
});
