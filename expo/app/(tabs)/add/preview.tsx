import { useEffect, useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import {
  ImageManipulator,
  ImageManipulatorContext,
  SaveFormat,
} from "expo-image-manipulator";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useFoodProvider } from "@/context/FoodContext";

export default function App() {
  const { addFood, resizeFood, analyzeFood } = useFoodProvider();
  const router = useRouter();
  const [uuid, setUuid] = useState<string | null>(null);

  const { uri, width, height } = useLocalSearchParams<{
    uri: string;
    width: string;
    height: string;
  }>();

  const handleSave = () => {
    analyzeFood(uuid!);

    router.push("/");
  };

  const handleDiscard = () => {
    router.push("/add");
  };

  const loadImage = async () => {
    const widthInt = parseInt(width);
    const heightInt = parseInt(height);

    const uuid = addFood({ uri, width: widthInt, height: heightInt });

    setUuid(uuid);
    resizeFood(uuid);
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
