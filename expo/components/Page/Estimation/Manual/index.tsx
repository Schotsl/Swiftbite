import { View, ScrollView } from "react-native";
import { Product } from "@/types/product";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ServingData } from "@/schemas/serving";
import { ManualData, manualSchema } from "@/schemas/insert/manual";

import variables from "@/variables";
import language from "@/language";

import Input from "@/components/Input";
import Header from "@/components/Header";
import Divider from "@/components/Divider";
import TextBody from "@/components/Text/Body";
import InputTime from "@/components/Input/Time";
import ButtonOverlay from "@/components/Button/Overlay";

import useInsertProduct from "@/mutations/useInsertProduct";
import useUpdateProduct from "@/mutations/useUpdateProduct";

export default function PageEstimationManual({
  product,
  created: propCreated,
  createdVisible = false,
  onSave,
  onDelete,
  onDuplicate,
}: {
  product?: Product;
  created?: Date;
  createdVisible?: boolean;

  onSave: (product: Product, serving: ServingData, created: Date) => void;
  onDelete?: () => void;
  onDuplicate?: (serving: ServingData) => void;
}) {
  const [saving, setSaving] = useState(false);

  const insertProduct = useInsertProduct();
  const updateProduct = useUpdateProduct();

  const { control, handleSubmit } = useForm<ManualData>({
    resolver: zodResolver(manualSchema),
    defaultValues: {
      title: product?.title ?? "",
      created_at: propCreated ?? new Date(),
      calorie_100g: product?.calorie_100g ?? 0,
      protein_100g: product?.protein_100g ?? 0,
      carbohydrate_100g: product?.carbohydrate_100g ?? 0,
      carbohydrate_sugar_100g: product?.carbohydrate_sugar_100g ?? 0,
      fat_100g: product?.fat_100g ?? 0,
      fat_trans_100g: product?.fat_trans_100g ?? 0,
      fat_saturated_100g: product?.fat_saturated_100g ?? 0,
      fat_unsaturated_100g: product?.fat_unsaturated_100g ?? 0,
      iron_100g: product?.iron_100g ?? 0,
      fiber_100g: product?.fiber_100g ?? 0,
      sodium_100g: product?.sodium_100g ?? 0,
      calcium_100g: product?.calcium_100g ?? 0,
      potassium_100g: product?.potassium_100g ?? 0,
      cholesterol_100g: product?.cholesterol_100g ?? 0,
    },
  });

  const serving = {
    gram: 100,
    option: "100-gram",
    quantity: 1,
  };

  const handleSave = async (data: ManualData) => {
    setSaving(true);

    if (product) {
      // TODO:
      if (product.type !== "manual") {
        throw new Error("Product must be of type manual");
      }

      const { created_at, ...rest } = data;

      await updateProduct.mutateAsync({
        ...product,
        ...rest,
      });

      onSave(product, serving, created_at);
    }

    const insert = await insertProduct.mutateAsync({
      serving: null,
      quantity: null,

      type: "manual",
      other: null,
      brand: null,
      search: null,
      barcode: null,
      options: null,
      category: null,
      embedding: null,
      estimated: false,
      processing: false,

      icon_id: null,

      ...data,
    });

    onSave(insert, serving, new Date());
  };

  return (
    <View>
      <ScrollView>
        <View
          style={{
            gap: variables.gap.large,
            padding: variables.padding.page,
            paddingBottom: variables.paddingOverlayTab,
          }}
        >
          <Header
            title={product?.title || language.page.estimation.manual.title}
            content={
              product ? undefined : language.page.estimation.manual.description
            }
            onDelete={onDelete}
            onDuplicate={onDuplicate && (() => onDuplicate(serving))}
          />

          <Input
            name="title"
            label={language.page.estimation.input.title.title}
            control={control}
            placeholder={language.page.estimation.input.title.placeholder}
          />

          <View style={{ gap: 24 }}>
            <View style={{ gap: 18 }}>
              <View style={{ gap: 18, flexDirection: "row" }}>
                <Input
                  type="decimal-pad"
                  name="calorie_100g"
                  style={{ flex: 1 }}
                  label={language.macros.calories.long}
                  suffix={language.macros.calories.short}
                  control={control}
                  placeholder="0"
                />

                <Input
                  type="decimal-pad"
                  name="protein_100g"
                  style={{ flex: 1 }}
                  label={language.macros.protein.long}
                  suffix={language.measurement.units.gram.long}
                  control={control}
                  placeholder="0"
                />
              </View>

              <View style={{ gap: 18, flexDirection: "row" }}>
                <Input
                  type="decimal-pad"
                  name="carbohydrate_100g"
                  style={{ flex: 1 }}
                  label={language.macros.carbs.long}
                  suffix={language.measurement.units.gram.long}
                  control={control}
                  placeholder="0"
                />

                <Input
                  type="decimal-pad"
                  name="fat_100g"
                  style={{ flex: 1 }}
                  label={language.macros.fats.long}
                  suffix={language.measurement.units.gram.long}
                  control={control}
                  placeholder="0"
                />
              </View>
            </View>

            <Divider />

            <View style={{ gap: 16 }}>
              <Input
                type="decimal-pad"
                name="fat_saturated_100g"
                label={language.macros.nutrients.fats.saturated}
                suffix={language.measurement.units.gram.long}
                control={control}
                placeholder="0"
              />

              <Input
                type="decimal-pad"
                name="fat_unsaturated_100g"
                label={language.macros.nutrients.fats.unsaturated}
                suffix={language.measurement.units.gram.long}
                control={control}
                placeholder="0"
              />

              <Input
                type="decimal-pad"
                name="fat_trans_100g"
                label={language.macros.nutrients.fats.trans}
                suffix={language.measurement.units.gram.long}
                control={control}
                placeholder="0"
              />

              <Input
                type="decimal-pad"
                name="carbohydrate_sugar_100g"
                label={language.macros.nutrients.carbs.sugar}
                suffix={language.measurement.units.gram.long}
                control={control}
                placeholder="0"
              />

              <Input
                type="decimal-pad"
                name="fiber_100g"
                label={language.macros.nutrients.carbs.fiber}
                suffix={language.measurement.units.gram.long}
                control={control}
                placeholder="0"
              />

              <Input
                type="decimal-pad"
                name="sodium_100g"
                label={language.macros.nutrients.salt}
                suffix={language.measurement.units.gram.long}
                control={control}
                placeholder="0"
              />

              <Input
                type="decimal-pad"
                name="iron_100g"
                label={language.macros.nutrients.iron}
                suffix={language.measurement.units.milligram.long}
                control={control}
                placeholder="0"
              />

              <Input
                type="decimal-pad"
                name="potassium_100g"
                label={language.macros.nutrients.potassium}
                suffix={language.measurement.units.gram.long}
                control={control}
                placeholder="0"
              />

              <Input
                type="decimal-pad"
                name="calcium_100g"
                label={language.macros.nutrients.calcium}
                suffix={language.measurement.units.gram.long}
                control={control}
                placeholder="0"
              />

              <Input
                type="decimal-pad"
                name="cholesterol_100g"
                label={language.macros.nutrients.cholesterol}
                suffix={language.measurement.units.milligram.long}
                control={control}
                placeholder="0"
              />
            </View>
          </View>

          {createdVisible && (
            <View style={{ gap: variables.gap.small }}>
              <TextBody weight="semibold">{language.input.time.group}</TextBody>

              <InputTime
                name="created_at"
                label={language.input.time.title}
                control={control}
              />
            </View>
          )}
        </View>
      </ScrollView>

      <ButtonOverlay
        tab={!product}
        title={
          product
            ? language.modifications.getEdit(language.types.estimation.single)
            : language.modifications.getSave(language.types.estimation.single)
        }
        onPress={handleSubmit(handleSave)}
        loading={saving}
        disabled={saving}
      />
    </View>
  );
}
