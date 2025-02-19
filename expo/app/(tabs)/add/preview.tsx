import { useEffect, useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useFoodProvider } from "@/context/FoodContext";
import { FoodItem } from "@/types";

export default function App() {
  const router = useRouter();

  const [food, setFood] = useState<FoodItem | null>(null);

  const { addFood, resizeFood, analyzeFood } = useFoodProvider();
  const { uri, width, height } = useLocalSearchParams<{
    uri: string;
    width: string;
    height: string;
  }>();

  const handleSave = () => {
    analyzeFood(food!);

    router.push("/");
  };

  const handleDiscard = () => {
    router.push("/add");
  };

  const loadImage = async () => {
    const widthInt = parseInt(width);
    const heightInt = parseInt(height);

    const food = addFood({ uri, width: widthInt, height: heightInt });

    setFood(food);

    resizeFood(food);
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
