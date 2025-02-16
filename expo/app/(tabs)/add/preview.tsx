import { useEffect } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import {
  ImageManipulator,
  ImageManipulatorContext,
  SaveFormat,
} from "expo-image-manipulator";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function App() {
  const router = useRouter();

  const { uri, width, height } = useLocalSearchParams<{
    uri: string;
    width: string;
    height: string;
  }>();

  const handleSave = () => {
    router.push("/");
  };

  const handleDiscard = () => {
    router.push("/add");
  };

  const loadImage = async () => {
    console.log("[DEVICE] Manipulating picture...");

    const smallManipulator = ImageManipulator.manipulate(uri as string);
    const largeManipulator = ImageManipulator.manipulate(uri as string);

    const imageWidth = parseInt(width);
    const imageHeight = parseInt(height);
    const imageLandscape = imageWidth > imageHeight;

    smallManipulator.resize({
      width: imageLandscape ? 512 : null,
      height: imageLandscape ? null : 512,
    });

    largeManipulator.resize({
      width: imageLandscape ? 1440 : null,
      height: imageLandscape ? null : 1440,
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

  useEffect(() => {
    loadImage();
  }, [uri, width, height]);

  return (
    <View style={{ flex: 1 }}>
      <Image
        source={{ uri }}
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
        }}
      />

      <View
        style={{
          flex: 1,
          margin: 64,
          flexDirection: "row",
        }}
      >
        <TouchableOpacity
          style={{ flex: 1, alignSelf: "flex-end", alignItems: "center" }}
          onPress={handleSave}
        >
          <Text style={{ fontSize: 24, fontWeight: "bold", color: "white" }}>
            Save
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{ flex: 1, alignSelf: "flex-end", alignItems: "center" }}
          onPress={handleDiscard}
        >
          <Text style={{ fontSize: 24, fontWeight: "bold", color: "white" }}>
            Discard
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
