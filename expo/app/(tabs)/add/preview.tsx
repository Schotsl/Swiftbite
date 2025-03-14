import { decode } from "base64-arraybuffer";
import { ImageManipulator } from "expo-image-manipulator";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

import { handleError, renderToBase64 } from "@/helper";
import useInsertEntry from "@/mutations/useInsertEntry";
import useInsertGenerative from "@/mutations/useInsertGenerative";
import useInsertIngredient from "@/mutations/useInsertIngredient";
import supabase from "@/utils/supabase";

export default function App() {
  const router = useRouter();

  const [smallImage, setSmallImage] = useState<string | null>(null);
  const [largeImage, setLargeImage] = useState<string | null>(null);

  const insertIngredient = useInsertIngredient();
  const insertGenerative = useInsertGenerative();
  const insertEntry = useInsertEntry();

  const { uri, width, height } = useLocalSearchParams<{
    uri: string;
    width: string;
    height: string;
  }>();

  const handleResize = useCallback(async () => {
    console.log("[DEVICE] Manipulating picture...");

    const smallManipulator = ImageManipulator.manipulate(uri);
    const largeManipulator = ImageManipulator.manipulate(uri);

    const isLandscape = width > height;

    smallManipulator.resize({
      width: isLandscape ? 512 : null,
      height: isLandscape ? null : 512,
    });

    largeManipulator.resize({
      width: isLandscape ? 1440 : null,
      height: isLandscape ? null : 1440,
    });

    const [imageBase64Small, imageBase64Large] = await Promise.all([
      renderToBase64(smallManipulator, true),
      renderToBase64(largeManipulator, false),
    ]);

    setSmallImage(imageBase64Small);
    setLargeImage(imageBase64Large);

    console.log("[DEVICE] Picture manipulated");
  }, [uri, width, height]);

  useEffect(() => {
    handleResize();
  }, [handleResize]);

  const handleSave = async () => {
    router.push("/");

    const ingredient = await insertIngredient.mutateAsync({
      type: "openfood",
      title: null,
      icon_id: null,
      calcium_100g: null,
      calorie_100g: null,
      carbohydrate_100g: null,
      carbohydrate_sugar_100g: null,
      cholesterol_100g: null,
      fat_100g: null,
      fat_saturated_100g: null,
      fat_trans_100g: null,
      fat_unsaturated_100g: null,
      fiber_100g: null,
      iron_100g: null,
      micros_100g: null,
      openfood_id: null,
      portion: null,
      potassium_100g: null,
      protein_100g: null,
      sodium_100g: null,
    });

    // The actual size will be updated by the server after analysis
    const entryPromise = insertEntry.mutateAsync({
      type: "ingredient",
      title: null,
      meal_id: null,
      ingredient_id: ingredient.uuid,
      consumed_unit: "gram",
      consumed_quantity: null,
    });

    const generativePromise = insertGenerative.mutateAsync({
      type: "image",
      content: null,
      ingredient_id: ingredient.uuid,
    });

    // We do both requests in parallel but discard the entry
    const [generative] = await Promise.all([generativePromise, entryPromise]);

    await Promise.all([
      uploadImage(`${generative.uuid}-small`, smallImage!),
      uploadImage(`${generative.uuid}`, largeImage!),
    ]);

    console.log("[DEVICE] All images uploaded");
  };

  const uploadImage = async (name: string, base64: string) => {
    const content = decode(base64);
    const contentType = "image/jpeg";

    const { error } = await supabase.storage
      .from("generative")
      .upload(name, content, {
        contentType,
      });

    handleError(error);
  };

  const handleDiscard = () => {
    router.push("/add");
  };

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
