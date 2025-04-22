import { router, useLocalSearchParams } from "expo-router";

import entryData from "@/queries/entryData";
import PageProduct from "@/components/Page/Product";
import useInsertEntry from "@/mutations/useInsertEntry";
import useUpdateEntry from "@/mutations/useUpdateEntry";

import { Product } from "@/types";
import { useQuery } from "@tanstack/react-query";

export default function AddPreviewBarcodeScreen() {
  const insertEntry = useInsertEntry();
  const updateEntry = useUpdateEntry();

  const { entry: entryId } = useLocalSearchParams<{ entry: string }>();
  const { data: entry } = useQuery({
    ...entryData({}),
    select: (entries) => entries.find((entry) => entry.uuid === entryId),
  });

  const product = entry?.product;
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
