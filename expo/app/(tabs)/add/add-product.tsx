import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { getOptions } from "@/helper";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { ServingData, servingSchema } from "@/schemas/serving";
import { useLocalSearchParams, useRouter } from "expo-router";

import Button from "@/components/Button";
import Header from "@/components/Header";
import HeaderLoading from "@/components/Header/Loading";
import useInsertEntry from "@/mutations/useInsertEntry";
import openfoodData from "@/queries/openfoodData";

import ProductStatus from "@/components/Product/Status";
import ProductInfo from "@/components/Product/Info";

import Input from "@/components/Input";
import InputDropdown from "@/components/Input/Dropdown";

export default function AddPreviewBarcodeScreen() {
  const router = useRouter();

  const insertEntry = useInsertEntry();

  const [saving, setSaving] = useState(false);

  const { title, brand, quantity_original, quantity_original_unit, barcode } =
    useLocalSearchParams<{
      entry?: string;
      title?: string;
      brand?: string;
      barcode?: string;
      quantity_original?: string;
      quantity_original_unit?: string;
    }>();

  const { data: product, isLoading } = useQuery(
    openfoodData({
      barcode,
      title,
      brand,
      quantity_original,
      quantity_original_unit,
    })
  );

  const { control, handleSubmit, setValue } = useForm<ServingData>({
    resolver: zodResolver(servingSchema),
    defaultValues: {
      option: "100-gram",
      quantity: "1",
    },
  });

  const handleSave = async (data: ServingData) => {
    setSaving(true);

    await insertEntry.mutateAsync({
      title: null,
      meal_id: null,
      product_id: product!.uuid,
      consumed_option: data.option,
      consumed_quantity: parseFloat(data.quantity),
    });

    setSaving(false);

    router.replace("/");
  };

  const info = useMemo(() => {
    const items = [];

    if (product?.barcode) {
      items.push({ icon: "barcode", value: product.barcode });
    }

    if (product?.quantity_original) {
      items.push({
        icon: "cube",
        value: `${product.quantity_original} ${product.quantity_original_unit}`,
      });
    }

    return items;
  }, [product]);

  const options = useMemo(() => {
    const optionsObject = getOptions(product);
    const optionsQuantity = optionsObject.find(
      (option) => option.value === "quantity"
    );

    const optionsServing = optionsObject.find(
      (option) => option.value === "serving"
    );

    if (optionsServing) {
      setValue("option", optionsServing.value);
    } else if (optionsQuantity) {
      setValue("option", optionsQuantity.value);
    } else {
      setValue("option", "100-gram");
    }
  }, [product, setValue]);

  if (isLoading) {
    return (
      <View style={{ padding: 32, minHeight: "100%" }}>
        <HeaderLoading />

        <ProductStatus status="We zijn het product in onze database aan het zoeken" />
      </View>
    );
  }

  return (
    <ScrollView style={{ minHeight: "100%" }}>
      <View style={{ padding: 32, gap: 48 }}>
        <View>
          <Header
            title={product!.title!}
            content={product!.brand}
            buttons={[
              {
                icon: "pencil",
                onPress: () => {},
              },
              {
                icon: "heart",
                onPress: () => {},
              },
              {
                icon: "repeat",
                onPress: () => {},
              },
            ]}
            small
          />

          <ProductInfo items={info} />
        </View>

        <View style={{ gap: 16 }}>
          <Text style={{ fontSize: 16, fontFamily: "OpenSans_600SemiBold" }}>
            Portie
          </Text>

          <InputDropdown
            name="option"
            label="Portie grote"
            options={options}
            control={control}
            placeholder="Selecteer een portie grote"
          />

          <Input
            name="quantity"
            type="numeric"
            label="Portie aantal"
            placeholder="Hoeveel porties heb je gegeten?"
            control={control}
          />
        </View>

        <Button
          title="Product opslaan"
          onPress={handleSubmit(handleSave)}
          loading={saving}
          disabled={saving}
        />
      </View>
    </ScrollView>
  );
}
