import { View } from "react-native";
import { decode } from "base64-arraybuffer";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useIsFocused } from "@react-navigation/native";
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
import Tabs from "@/components/Tabs";
import { Divider } from "@/components/Divider";

export default function PageEstimationManual() {
  const focus = useIsFocused();
  const router = useRouter();

  const initialImage = useLocalSearchParams<{
    uri?: string;
    width?: string;
    height?: string;
  }>();

  const { uri, width, height } = initialImage;

  const [saving, setSaving] = useState(false);
  const [image, setImage] = useState<ImageType | null>(
    uri && width && height
      ? {
          uri,
          width: parseInt(width),
          height: parseInt(height),
        }
      : null
  );

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

    setSaving(true);

    const product = await insertProduct.mutateAsync({
      title: data.title ?? null,
      image: null,
      brand: null,
      barcode: null,
      options: null,
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
      potassium_100g: null,
      protein_100g: null,
      sodium_100g: null,

      serving_gram: null,
      serving_original: null,
      serving_original_unit: null,

      quantity_gram: null,
      quantity_original: null,
      quantity_original_unit: null,
    });

    const entryPromise = insertEntry.mutateAsync({
      meal_id: null,
      product_id: product.uuid,
      consumed_gram: null,
      consumed_option: null,
      consumed_quantity: null,
    });

    const generativePromise = insertGenerative.mutateAsync({
      image: !!image,
      content: data.content ?? null,
      product_id: product.uuid,
    });

    const [generative] = await Promise.all([generativePromise, entryPromise]);

    if (!image) {
      console.log("[DEVICE] No image has been selected so skipping upload");

      router.replace("/");

      return;
    }

    await Promise.all([
      uploadImage(`${generative.uuid}-small`, smallImage!),
      uploadImage(`${generative.uuid}`, largeImage!),
    ]);

    console.log("[DEVICE] All images uploaded");

    router.replace("/");
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
    <View
      style={{
        padding: 32,
      }}
    >
      <Header
        title="Handmatig inschatten"
        content="Hier kun je een maaltijd snel vastleggen door alleen calorieën en macro’s handmatig in te vullen, dit is geen product"
      />

      <View style={{ gap: 48 }}>
        <Input
          name="title"
          label="Titel"
          control={control}
          placeholder="Wrap"
        />

        <View style={{ gap: 24 }}>
          <View style={{ gap: 18 }}>
            <View style={{ gap: 18, flexDirection: "row" }}>
              <Input
                name="calorie"
                label="Calorieën"
                suffix="kcal"
                control={control}
                placeholder="100"
              />

              <Input
                name="protein"
                label="Eiwit"
                suffix="gram"
                control={control}
                placeholder="100"
              />
            </View>
            <View style={{ gap: 18, flexDirection: "row" }}>
              <Input
                name="carbs"
                label="Koolhydraten"
                suffix="gram"
                control={control}
                placeholder="100"
              />

              <Input
                name="fat"
                label="Vet"
                suffix="gram"
                control={control}
                placeholder="100"
              />
            </View>
          </View>

          <Divider />

          <View style={{ gap: 16 }}>
            <Input
              name="fat_saturated"
              label="Verzadigd vet"
              suffix="gram"
              control={control}
              placeholder="100"
            />

            <Input
              name="fat_unsaturated"
              label="Onverzadigd vet"
              suffix="gram"
              control={control}
              placeholder="100"
            />

            <Input
              name="carbohydrate_sugar"
              label="Suiker"
              suffix="gram"
              control={control}
              placeholder="100"
            />

            <Input
              name="fiber"
              label="Vezels"
              suffix="gram"
              control={control}
              placeholder="100"
            />

            <Input
              name="sodium"
              label="Zout"
              suffix="gram"
              control={control}
              placeholder="100"
            />
          </View>
        </View>

        <Button
          title="Product opslaan"
          onPress={handleSubmit(handleSave)}
          loading={saving}
          disabled={saving}
        />
      </View>
    </View>
  );
}
