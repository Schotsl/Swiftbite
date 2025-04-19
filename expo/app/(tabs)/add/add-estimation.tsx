import { useIsFocused } from "@react-navigation/native";
import { decode } from "base64-arraybuffer";
import { ImageManipulator } from "expo-image-manipulator";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

import { handleError, renderToBase64 } from "@/helper";
import useInsertEntry from "@/mutations/useInsertEntry";
import useInsertGenerative from "@/mutations/useInsertGenerative";
import useInsertProduct from "@/mutations/useInsertProduct";
import supabase from "@/utils/supabase";
import Header from "@/components/Header";
import Button from "@/components/Button";
import Input from "@/components/Input";
import { useForm } from "react-hook-form";
import { EstimationData, estimationSchema } from "@/schemas/serving";
import { zodResolver } from "@hookform/resolvers/zod";
import EstimationImage from "@/components/Estimation/Image";

export default function Add2Preview() {
  const focus = useIsFocused();
  const router = useRouter();

  const [smallImage, setSmallImage] = useState<string | null>(null);
  const [largeImage, setLargeImage] = useState<string | null>(null);

  const insertEntry = useInsertEntry();
  const insertProduct = useInsertProduct();
  const insertGenerative = useInsertGenerative();

  const { uri, width, height } = useLocalSearchParams<{
    uri: string;
    width: string;
    height: string;
  }>();

  const widthNumber = parseInt(width);
  const heightNumber = parseInt(height);

  const { control, handleSubmit } = useForm<EstimationData>({
    resolver: zodResolver(estimationSchema),
  });

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

    const product = await insertProduct.mutateAsync({
      type: "openfood",
      title: null,
      image: null,
      brand: null,
      estimated: true,

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
      serving: null,
      serving_unit: null,
      potassium_100g: null,
      protein_100g: null,
      sodium_100g: null,
      quantity: null,
      quantity_unit: null,
    });

    // The actual size will be updated by the server after analysis
    const entryPromise = insertEntry.mutateAsync({
      type: "product",
      title: null,
      meal_id: null,
      product_id: product.uuid,
      consumed_unit: null,
      consumed_quantity: null,
    });

    const generativePromise = insertGenerative.mutateAsync({
      type: "image",
      content: null,
      product_id: product.uuid,
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

  // Reset the page's state when is the screen is unfocused
  useEffect(() => {
    if (focus) {
      return;
    }

    setSmallImage(null);
    setLargeImage(null);
  }, [focus]);

  return (
    <ScrollView
      style={{
        minHeight: "100%",
      }}
    >
      <View
        style={{
          gap: 24,
          padding: 32,
          paddingBottom: 64,

          minHeight: "100%",
        }}
      >
        <Header title="Add" />

        <EstimationImage
          image={uri}
          width={widthNumber}
          height={heightNumber}
        />

        <Input
          name="title"
          label="Titel"
          placeholder="Banaan"
          control={control}
        />
        <Input
          name="description"
          label="Beschrijving"
          placeholder="100g"
          control={control}
        />

        <Button
          onPress={handleSubmit(handleSave)}
          title="Product opslaan"
          style={{ marginTop: "auto" }}
        />
      </View>
    </ScrollView>
  );
}
