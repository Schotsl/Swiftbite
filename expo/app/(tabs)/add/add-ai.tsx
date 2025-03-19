import { useIsFocused } from "@react-navigation/native";
import { CameraType, CameraView } from "expo-camera";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

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

  if (!focus) {
    return null;
  }

  return (
    <View style={styles.container}>
      <CameraView ref={camera} facing={facing} style={styles.camera}>
        <View style={styles.controls}>
          <TouchableOpacity style={styles.button} onPress={flipImage}>
            <Text style={styles.buttonText}>Flip Camera</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={takeImage}>
            <Text style={styles.buttonText}>Take Photo</Text>
          </TouchableOpacity>
        </View>
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
