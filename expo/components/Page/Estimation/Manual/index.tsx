import { View } from "react-native";
import { useForm } from "react-hook-form";
import { Divider } from "@/components/Divider";
import { useState } from "react";
import { useRouter } from "expo-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProductManual } from "@/types";
import { ManualData, manualSchema } from "@/schemas/insert/manual";

import Input from "@/components/Input";
import Header from "@/components/Header";
import ButtonOverlay from "@/components/Button/Overlay";

import useInsertEntry from "@/mutations/useInsertEntry";
import useInsertProduct from "@/mutations/useInsertProduct";
import useUpdateProduct from "@/mutations/useUpdateProduct";
import { ScrollView } from "react-native-gesture-handler";
import { ServingData } from "@/schemas/serving";

export default function PageEstimationManual({
  product,
  onDelete,
  onRepeat,
}: {
  product?: ProductManual;
  onDelete?: () => void;
  onRepeat?: (serving: ServingData) => void;
}) {
  const router = useRouter();

  const [saving, setSaving] = useState(false);

  const insertEntry = useInsertEntry();
  const insertProduct = useInsertProduct();
  const updateProduct = useUpdateProduct();

  const { control, handleSubmit } = useForm<ManualData>({
    resolver: zodResolver(manualSchema),
    defaultValues: {
      calorie_100g: 0,
      protein_100g: 0,
      carbohydrate_100g: 0,
      carbohydrate_sugar_100g: 0,
      fat_100g: 0,
      fat_trans_100g: 0,
      fat_saturated_100g: 0,
      fat_unsaturated_100g: 0,
      iron_100g: 0,
      fiber_100g: 0,
      sodium_100g: 0,
      calcium_100g: 0,
      potassium_100g: 0,
      cholesterol_100g: 0,
      ...product,
    },
  });

  const serving = {
    gram: 100,
    option: "g",
    quantity: 1,
  };

  const handleSave = async (data: ManualData) => {
    setSaving(true);

    if (product) {
      await updateProduct.mutateAsync({
        ...product,
        ...data,
      });

      router.replace("/");

      return;
    }

    const insert = await insertProduct.mutateAsync({
      type: "manual",
      brand: null,
      barcode: null,
      options: null,
      favorite: false,
      estimated: false,

      icon_id: null,

      serving_gram: serving.gram,
      serving_original: serving.quantity,
      serving_original_unit: serving.option,

      quantity_gram: 100,
      quantity_original: 1,
      quantity_original_unit: "g",
      ...data,
    });

    await insertEntry.mutateAsync({
      meal_id: null,
      product_id: insert.uuid,
      consumed_gram: serving.gram,
      consumed_option: serving.option,
      consumed_quantity: serving.quantity,
    });

    router.replace("/");
  };

  return (
    <View>
      <ScrollView
        style={{
          padding: 32,
        }}
      >
        <Header
          title={product ? product.title : "Handmatig inschatten"}
          content={
            product
              ? undefined
              : "Hier kun je een maaltijd snel vastleggen door alleen calorieën en macro's handmatig in te vullen, dit is geen product"
          }
          onDelete={onDelete}
          onRepeat={onRepeat && (() => onRepeat(serving))}
        />

        <View style={{ gap: 48 }}>
          {!product && (
            <Input
              name="title"
              label="Titel"
              control={control}
              placeholder="Wrap"
            />
          )}

          <View style={{ gap: 24 }}>
            <View style={{ gap: 18 }}>
              <View style={{ gap: 18, flexDirection: "row" }}>
                <Input
                  type="number-pad"
                  name="calorie_100g"
                  label="Calorieën"
                  suffix="kcal"
                  control={control}
                  placeholder="0"
                />

                <Input
                  type="number-pad"
                  name="protein_100g"
                  label="Eiwit"
                  suffix="gram"
                  control={control}
                  placeholder="0"
                />
              </View>

              <View style={{ gap: 18, flexDirection: "row" }}>
                <Input
                  type="number-pad"
                  name="carbohydrate_100g"
                  label="Koolhydraten"
                  suffix="gram"
                  control={control}
                  placeholder="0"
                />

                <Input
                  type="number-pad"
                  name="fat_100g"
                  label="Vetten"
                  suffix="gram"
                  control={control}
                  placeholder="0"
                />
              </View>
            </View>

            <Divider />

            <View style={{ gap: 16 }}>
              <Input
                type="number-pad"
                name="fat_saturated_100g"
                label="Verzadigd vet"
                suffix="gram"
                control={control}
                placeholder="0"
              />

              <Input
                type="number-pad"
                name="fat_unsaturated_100g"
                label="Onverzadigd vet"
                suffix="gram"
                control={control}
                placeholder="0"
              />

              <Input
                type="number-pad"
                name="fat_trans_100g"
                label="Transvet"
                suffix="gram"
                control={control}
                placeholder="0"
              />

              <Input
                type="number-pad"
                name="carbohydrate_sugar_100g"
                label="Suiker"
                suffix="gram"
                control={control}
                placeholder="0"
              />

              <Input
                type="number-pad"
                name="fiber_100g"
                label="Vezels"
                suffix="gram"
                control={control}
                placeholder="0"
              />

              <Input
                type="number-pad"
                name="sodium_100g"
                label="Zout"
                suffix="gram"
                control={control}
                placeholder="0"
              />

              <Input
                type="number-pad"
                name="iron_100g"
                label="IJzer"
                suffix="mg"
                control={control}
                placeholder="0"
              />

              <Input
                type="number-pad"
                name="potassium_100g"
                label="Kalium"
                suffix="gram"
                control={control}
                placeholder="0"
              />

              <Input
                type="number-pad"
                name="calcium_100g"
                label="Calcium"
                suffix="gram"
                control={control}
                placeholder="0"
              />

              <Input
                type="number-pad"
                name="cholesterol_100g"
                label="Cholesterol"
                suffix="mg"
                control={control}
                placeholder="0"
              />
            </View>
          </View>
        </View>
      </ScrollView>

      <ButtonOverlay
        tab={!product}
        title={product ? "Inschatting wijzigen" : "Inschatting opslaan"}
        onPress={handleSubmit(handleSave)}
        loading={saving}
        disabled={saving}
      />
    </View>
  );
}
