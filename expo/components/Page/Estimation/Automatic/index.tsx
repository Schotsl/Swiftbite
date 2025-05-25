import { View } from "react-native";
import { decode } from "base64-arraybuffer";
import { useForm } from "react-hook-form";
import { Product } from "@/types/product";
import { ScrollView } from "react-native-gesture-handler";
import { zodResolver } from "@hookform/resolvers/zod";
import { useIsFocused } from "@react-navigation/native";
import { CameraSelected } from "@/types";
import { ImageManipulator } from "expo-image-manipulator";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { handleError, renderToBase64, transformImage } from "@/helper";
import {
  EstimationData,
  estimationSchema,
  ServingData,
} from "@/schemas/serving";

import supabase from "@/utils/supabase";
import variables from "@/variables";

import useInsertProduct from "@/mutations/useInsertProduct";
import useInsertGenerative from "@/mutations/useInsertGenerative";

import Input from "@/components/Input";
import Header from "@/components/Header";
import EstimationImage from "@/components/Estimation/Image";
import ButtonOverlay from "@/components/Button/Overlay";

type PageEstimationAutomaticProps = {
  tab?: boolean;
  onSave: (
    product: Product,
    serving: ServingData | null,
    created: Date,
  ) => void;
};

export default function PageEstimationAutomatic({
  tab,
  onSave,
}: PageEstimationAutomaticProps) {
  const focus = useIsFocused();

  const { uri, width, height, title, content } = useLocalSearchParams<{
    uri?: string;
    width?: string;
    height?: string;

    title?: string;
    content?: string;
  }>();

  const image = transformImage(uri, width, height);

  const [saving, setSaving] = useState(false);

  const [smallImage, setSmallImage] = useState<string | null>(null);
  const [largeImage, setLargeImage] = useState<string | null>(null);

  const insertProduct = useInsertProduct();
  const insertGenerative = useInsertGenerative();

  const { control, setError, handleSubmit } = useForm<EstimationData>({
    resolver: zodResolver(estimationSchema),
    defaultValues: { title, content },
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

  const handleCamera = () => {
    router.push({
      pathname: "/add/camera",
      params: {
        title,
        content,
        initial: CameraSelected.Estimation,
      },
    });
  };

  const handleSave = async (data: EstimationData) => {
    // TODO: This should probably be done within ZOD
    if (!validateSave(data)) {
      return;
    }

    setSaving(true);

    const product = await insertProduct.mutateAsync({
      type: "generative",
      title: data.title ?? null,
      brand: null,
      search: null,
      serving: null,
      barcode: null,
      options: null,
      quantity: null,
      category: null,
      estimated: true,
      embedding: null,
      processing: true,

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
    });

    const generative = await insertGenerative.mutateAsync({
      image: !!image,
      content: data.content ?? null,
      product_id: product.uuid,
    });

    if (!image) {
      console.log("[DEVICE] No image has been selected so skipping upload");

      onSave(product, null, new Date());

      return;
    }

    await Promise.all([
      uploadImage(`${generative.uuid}-small`, smallImage!),
      uploadImage(`${generative.uuid}`, largeImage!),
    ]);

    console.log("[DEVICE] All images uploaded");

    onSave(product, null, new Date());
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
    <View>
      <ScrollView>
        <View
          style={{
            gap: variables.gap.large,
            padding: variables.padding.page,
            paddingBottom: variables.paddingOverlay,
          }}
        >
          <Header
            title="Automatisch inschatten"
            content="Dit is een AI-inschatting van de calorieën en macro's van je maaltijd. Controleer het resultaat en pas het zo nodig aan op het volgende scherm."
          />

          <View style={{ gap: 24 }}>
            <EstimationImage
              image={image}
              required={!!image}
              // TODO: This should be done with a parameter storing the title or content
              onAdd={handleCamera}
              onEdit={handleCamera}
              onDelete={() => {}}
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
        </View>
      </ScrollView>

      <ButtonOverlay
        // TODO: Language
        tab={tab}
        title="Product opslaan"
        onPress={handleSubmit(handleSave)}
        loading={saving}
        disabled={saving}
      />
    </View>
  );
}
