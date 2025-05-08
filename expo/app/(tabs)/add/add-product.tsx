import entryData from "@/queries/entryData";
import openfoodData from "@/queries/openfoodData";

import useInsertEntry from "@/mutations/useInsertEntry";
import useUpdateEntry from "@/mutations/useUpdateEntry";

import PageProduct from "@/components/Page/Product";
import HeaderLoading from "@/components/Header/Loading";
import ProductStatus from "@/components/Product/Status";

import { View } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { EntryWithProduct, Product } from "@/types";
import { Redirect, router, useLocalSearchParams } from "expo-router";

export default function AddPreviewBarcodeScreen() {
  const insertEntry = useInsertEntry();
  const updateEntry = useUpdateEntry();

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

  if (!product) {
    return <Redirect href="/" />;
  }

  const serving = entry
    ? {
        gram: entry?.consumed_gram!,
        option: entry?.consumed_option!,
        quantity: entry?.consumed_quantity!,
      }
    : undefined;

  return (
    <PageProduct
      product={product}
      serving={serving}
      onSave={async (productReturned, returnedServing) => {
        // Update the entry if it exists
        if (entry) {
          await updateEntry.mutateAsync({
            ...entry,
            consumed_gram: returnedServing.gram,
            consumed_option: returnedServing.option,
            consumed_quantity: returnedServing.quantity,
          });

          router.replace("/");

          return;
        }

        // TODO: This probably shouldn't be needed
        const productCast = productReturned as Product;

        // Otherwise, create a new entry
        await insertEntry.mutateAsync({
          meal_id: null,
          product_id: productCast.uuid,
          consumed_gram: returnedServing.gram,
          consumed_option: returnedServing.option,
          consumed_quantity: returnedServing.quantity,
        });

        router.replace("/");
      }}
    />
  );
}
