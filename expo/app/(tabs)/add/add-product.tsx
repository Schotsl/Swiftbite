import entryData from "@/queries/entryData";
import openfoodData from "@/queries/openfoodData";

import useInsertEntry from "@/mutations/useInsertEntry";
import useUpdateEntry from "@/mutations/useUpdateEntry";
import useDeleteEntry from "@/mutations/useDeleteEntry";

import PageProduct from "@/components/Page/Product";
import HeaderLoading from "@/components/Header/Loading";
import ProductStatus from "@/components/Product/Status";

import { View } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { ServingData } from "@/schemas/serving";
import { EntryWithProduct } from "@/types";
import { Redirect, router, useLocalSearchParams } from "expo-router";

export default function AddPreviewBarcodeScreen() {
  const insertEntry = useInsertEntry();
  const updateEntry = useUpdateEntry();
  const deleteEntry = useDeleteEntry();

  const {
    entry: entryId,
    title,
    brand,
    barcode,
    quantity_original,
    quantity_original_unit,
  } = useLocalSearchParams<{
    entry: string;
    title: string;
    brand: string;
    barcode: string;
    quantity_original: string;
    quantity_original_unit: string;
  }>();

  const { data: entry, isLoading: isLoadingEntry } = useQuery({
    ...entryData<EntryWithProduct>({}),
    select: (entries) => entries.find((entry) => entry.uuid === entryId),
    enabled: !!entryId,
  });

  const { data: productOpenfood, isLoading: isLoadingOpenfood } = useQuery({
    ...openfoodData({
      title,
      brand,
      barcode,
      quantity_original,
      quantity_original_unit,
    }),
    enabled: !entryId,
  });

  if (isLoadingEntry || isLoadingOpenfood) {
    return (
      <View style={{ padding: 32, minHeight: "100%" }}>
        <HeaderLoading />

        <ProductStatus status="We zijn het product in onze database aan het zoeken" />
      </View>
    );
  }

  const productEntry = entry?.product;
  const product = productEntry || productOpenfood;
  const serving = entry
    ? {
        gram: entry?.consumed_gram!,
        option: entry?.consumed_option!,
        quantity: entry?.consumed_quantity!,
      }
    : undefined;

  if (!product) {
    return <Redirect href="/" />;
  }

  const handleSave = async (returnedServing: ServingData) => {
    if (entry) {
      // If we have a existing entry we'll update it
      await updateEntry.mutateAsync({
        ...entry,
        consumed_gram: returnedServing.gram,
        consumed_option: returnedServing.option,
        consumed_quantity: returnedServing.quantity,
      });

      router.replace("/");

      return;
    }

    // Otherwise we'll create a new entry
    await insertEntry.mutateAsync({
      meal_id: null,
      product_id: product.uuid,
      consumed_gram: returnedServing.gram,
      consumed_option: returnedServing.option,
      consumed_quantity: returnedServing.quantity,
    });

    router.replace("/");
  };

  const handleDelete = async () => {
    if (!entry) {
      return;
    }

    await deleteEntry.mutateAsync(entry.uuid);

    router.replace("/");
  };

  const handleRepeat = async (serving: ServingData) => {
    if (!entry) {
      return;
    }

    await insertEntry.mutateAsync({
      meal_id: null,
      product_id: product.uuid,
      consumed_gram: serving.gram,
      consumed_option: serving.option,
      consumed_quantity: serving.quantity,
    });

    router.replace("/");
  };

  return (
    <PageProduct
      product={product}
      serving={serving}
      onSave={handleSave}
      onDelete={entry ? handleDelete : undefined}
      onRepeat={entry ? handleRepeat : undefined}
    />
  );
}
