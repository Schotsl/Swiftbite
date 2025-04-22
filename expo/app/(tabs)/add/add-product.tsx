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
import { Option } from "@/types";

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
    openfoodData({ barcode, title, brand, quantity })
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
    let options = [
      {
        title: "1 g",
        value: "1-gram",
        gram: 1,
      },
      {
        title: "100 g",
        value: "100-gram",
        gram: 100,
      },
    ];

    if (product?.quantity_original) {
      options.push({
        title: `Productinhoud (${product.quantity_original} ${product.quantity_original_unit})`,
        value: `quantity`,
        gram: product.quantity_original,
      });

      setValue("option", `quantity`);
    }

    if (product?.serving_original) {
      options.push({
        title: `Portiegrootte (${product.serving_original} ${product.serving_original_unit})`,
        value: `serving`,
        gram: product.serving_gram!,
      });

      setValue("option", `serving`);
    }

    if (product?.options) {
      const productOptions = product?.options as Option[];

      productOptions.forEach((productOption) => {
        options.push({
          title: `${productOption.title} (${productOption.gram} g)`,
          value: productOption.value,
          gram: productOption.gram,
        });
      });
    }

    return options;
  }, [product]);

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
