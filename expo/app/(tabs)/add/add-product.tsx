import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
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

  const { title, brand, quantity, barcode } = useLocalSearchParams<{
    entry?: string;
    title?: string;
    brand?: string;
    barcode?: string;
    quantity?: string;
  }>();

  const { data: product, isLoading } = useQuery(
    openfoodData({ barcode, title, brand, quantity }),
  );

  const { control, handleSubmit } = useForm<ServingData>({
    resolver: zodResolver(servingSchema),
    defaultValues: {
      option: "1",
      quantity: "1",
    },
  });

  const handleSave = async (data: ServingData) => {
    setSaving(true);

    const option = options.find((option) => option.id === data.option)!;
    const optionValue = parseFloat(option.value);

    const amountMultiplier = parseFloat(data.quantity);
    const amountGrams = optionValue * amountMultiplier;

    await insertEntry.mutateAsync({
      type: "product",
      title: null,
      meal_id: null,
      product_id: product!.uuid,
      consumed_unit: "g",
      consumed_quantity: amountGrams,
    });

    setSaving(false);

    router.replace("/");
  };

  const info = useMemo(() => {
    const items = [];

    if (product?.openfood_id) {
      items.push({ icon: "barcode", value: product.openfood_id });
    }

    if (product?.quantity) {
      items.push({
        icon: "cube",
        value: `${product.quantity}${product.quantity_unit}`,
      });
    }

    return items;
  }, [product]);

  if (isLoading) {
    return (
      <View style={{ padding: 32, minHeight: "100%" }}>
        <HeaderLoading />

        <ProductStatus status="We zijn het product in onze database aan het zoeken" />
      </View>
    );
  }

  const options = [
    {
      id: "1",
      label: "1g",
      value: "1",
    },
    {
      id: "2",
      label: "100g",
      value: "100",
    },
  ];

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
