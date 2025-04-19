import { decode } from "base64-arraybuffer";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useIsFocused } from "@react-navigation/native";
import { ScrollView, View } from "react-native";
import { ImageManipulator } from "expo-image-manipulator";
import { Image as ImageType } from "@/types";
import { handleError, renderToBase64 } from "@/helper";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { EstimationData, estimationSchema } from "@/schemas/serving";

import supabase from "@/utils/supabase";

import Input from "@/components/Input";
import Button from "@/components/Button";
import Header from "@/components/Header";
import EstimationImage from "@/components/Estimation/Image";
import useInsertEntry from "@/mutations/useInsertEntry";
import useInsertProduct from "@/mutations/useInsertProduct";
import useInsertGenerative from "@/mutations/useInsertGenerative";

export default function Add2Preview() {
  const initialImage = useLocalSearchParams<{
    uri: string;
    width: string;
    height: string;
  }>();

  const focus = useIsFocused();
  const router = useRouter();

  const [image, setImage] = useState<ImageType | null>({
    ...initialImage,
    width: parseInt(initialImage.width),
    height: parseInt(initialImage.height),
  });

  const [smallImage, setSmallImage] = useState<string | null>(null);
  const [largeImage, setLargeImage] = useState<string | null>(null);

  const insertEntry = useInsertEntry();
  const insertProduct = useInsertProduct();
  const insertGenerative = useInsertGenerative();

  const { control, setError, handleSubmit } = useForm<EstimationData>({
    resolver: zodResolver(estimationSchema),
  });

  const handleResize = useCallback(async () => {
    if (!image) {
      return;
    }

    console.log("[DEVICE] Manipulating picture...");

    const smallManipulator = ImageManipulator.manipulate(image.uri);
    const largeManipulator = ImageManipulator.manipulate(image.uri);

    const isLandscape = image.width > image.height;

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
  }, [image]);

  useEffect(() => {
    handleResize();
  }, [handleResize]);

  const validateSave = (data: EstimationData) => {
    if (image) {
      return true;
    }

    if (!data.title || data.title.trim() === "") {
      setError("title", {
        type: "manual",
        message: `Een titel is verplicht als er geen afbeelding is geselecteerd`,
      });

      return false;
    }

    return true;
  };

  const handleSave = async (data: EstimationData) => {
    // TODO: This should probably be done within ZOD
    if (!validateSave(data)) {
      return;
    }

    router.push("/");

    const product = await insertProduct.mutateAsync({
      type: "openfood",
      title: data.title ?? null,
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

    const entryPromise = insertEntry.mutateAsync({
      type: "product",
      title: data.title ?? null,
      meal_id: null,
      product_id: product.uuid,
      consumed_unit: null,
      consumed_quantity: null,
    });

    const generativePromise = insertGenerative.mutateAsync({
      type: "image",
      image: !!image,
      content: data.content ?? null,
      product_id: product.uuid,
    });

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

  useEffect(() => {
    if (focus) {
      return;
    }

    setSmallImage(null);
    setLargeImage(null);
  }, [focus]);

  return (
    <ScrollView>
      <View
        style={{
          padding: 32,
        }}
      >
        <Header
          title="Add"
          content="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod  tempor incididunt."
        />

        <View style={{ gap: 48 }}>
          <View style={{ gap: 24 }}>
            <EstimationImage
              image={image}
              required={!!image}
              onAdd={() => router.back()}
              onEdit={() => router.back()}
              onDelete={() => setImage(null)}
            />

            <Input
              name="title"
              label="Titel"
              required={!image}
              placeholder="Wrap"
              control={control}
            />

            <Input
              name="content"
              label="Beschrijving"
              content="Informatie die niet makkelijk uit de foto te halen is, is relevant, zoals bijvoorbeeld de inhoud van een wrap."
              placeholder="Een wrap met kip, sla, tomaat, avocado..."
              control={control}
              required={false}
              multiline
            />
          </View>

          <Button title="Product opslaan" onPress={handleSubmit(handleSave)} />
        </View>
      </View>
    </ScrollView>
  );
}
