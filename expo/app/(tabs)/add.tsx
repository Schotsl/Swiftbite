import { CameraView, CameraType } from "expo-camera";
import { useRef, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import {
  ImageManipulator,
  ImageManipulatorContext,
  SaveFormat,
} from "expo-image-manipulator";

export default function App() {
  const camera = useRef<CameraView>(null);
  const [facing, setFacing] = useState<CameraType>("back");

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  const takePicture = async () => {
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

    console.log("[DEVICE] Manipulating picture...");

    const smallManipulator = ImageManipulator.manipulate(picture.uri);
    const largeManipulator = ImageManipulator.manipulate(picture.uri);

    const pictureLandscape = picture.width > picture.height;

    smallManipulator.resize({
      width: pictureLandscape ? 512 : null,
      height: pictureLandscape ? null : 512,
    });

    largeManipulator.resize({
      width: pictureLandscape ? 1440 : null,
      height: pictureLandscape ? null : 1440,
    });

    const [smallBase64, largeBase64] = await Promise.all([
      renderToBase64(smallManipulator, true),
      renderToBase64(largeManipulator, false),
    ]);

    console.log("[DEVICE] Picture manipulated");

    fetchTitle(smallBase64);
    fetchNutrition(largeBase64);
  };

  const renderToBase64 = async (
    manipulator: ImageManipulatorContext,
    compressed: boolean
  ) => {
    const format = SaveFormat.JPEG;
    const base64 = true;
    const compress = compressed ? 0.5 : 1;

    const manipulatorRender = await manipulator.renderAsync();
    const manipulatorSaved = await manipulatorRender.saveAsync({
      format,
      base64,
      compress,
    });

    return manipulatorSaved.base64!;
  };

  const fetchTitle = async (image: string) => {
    console.log("[API] Fetching title...");

    const url = "https://swiftbite.app/api/fetch-title";
    const body = JSON.stringify({ image });
    const method = "POST";

    const response = await fetch(url, { body, method });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const parsed = await response.json();

    console.log("[API] Received title");

    return parsed.title;
  };

  const fetchNutrition = async (image: string) => {
    console.log("[API] Fetching nutrition...");

    const url = "https://swiftbite.app/api/fetch-nutrition";
    const body = JSON.stringify({ image });
    const method = "POST";

    const response = await fetch(url, { body, method });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const parsed = await response.json();

    console.log("[API] Received nutrition");

    return parsed.nutrition;
  };

  return (
    <CameraView
      ref={camera}
      facing={facing}
      style={{
        flex: 1,
      }}
    >
      <View
        style={{
          flex: 1,
          margin: 64,
          flexDirection: "row",
        }}
      >
        <TouchableOpacity
          style={{ flex: 1, alignSelf: "flex-end", alignItems: "center" }}
          onPress={toggleCameraFacing}
        >
          <Text style={{ fontSize: 24, fontWeight: "bold", color: "white" }}>
            Flip
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{ flex: 1, alignSelf: "flex-end", alignItems: "center" }}
          onPress={takePicture}
        >
          <Text style={{ fontSize: 24, fontWeight: "bold", color: "white" }}>
            Snap
          </Text>
        </TouchableOpacity>
      </View>
    </CameraView>
  );
}
