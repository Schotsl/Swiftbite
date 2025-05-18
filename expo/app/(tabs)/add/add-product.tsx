import entryData from "@/queries/entryData";
import productData from "@/queries/productData";

import useInsertEntry from "@/mutations/useInsertEntry";
import useUpdateEntry from "@/mutations/useUpdateEntry";
import useDeleteEntry from "@/mutations/useDeleteEntry";

import PageProduct from "@/components/Page/Product";
import HeaderLoading from "@/components/Header/Loading";
import ProductStatus from "@/components/Product/Status";

import { View } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { ServingData } from "@/schemas/serving";
import { Redirect, useLocalSearchParams, useRouter } from "expo-router";

export default function AddPreviewBarcodeScreen() {
  const router = useRouter();

  const insertEntry = useInsertEntry();
  const updateEntry = useUpdateEntry();
  const deleteEntry = useDeleteEntry();

  const {
    barcode,
    entry: entryId,
    product: productId,
  } = useLocalSearchParams<{
    entry: string;
    product: string;
    barcode: string;
  }>();

  const { data: entry, isLoading: isLoadingEntry } = useQuery({
    ...entryData({ uuid: entryId }),
    select: (entries) => entries[0],
    enabled: !!entryId,
  });

  const { data: productObject, isLoading: isLoadingProduct } = useQuery({
    ...productData(productId ? { uuid: productId } : { barcode }),
    select: (products) => products[0],
    enabled: !entryId,
  });

  if (isLoadingEntry || isLoadingProduct) {
    return (
      <View style={{ padding: 32, minHeight: "100%" }}>
        <HeaderLoading />

        <ProductStatus status="We zijn het product in onze database aan het zoeken" />
      </View>
    );
  }

  const productEntry = entry?.product;
  const product = productEntry || productObject;
  const serving = entry?.serving;

  if (!product) {
    return <Redirect href="/" />;
  }

  const handleSave = async (
    returnedServing: ServingData,
    returnedCreated: Date,
  ) => {
    if (entry) {
      // If we have a existing entry we'll update it
      await updateEntry.mutateAsync({
        ...entry,
        serving: returnedServing,
        created_at: returnedCreated,
      });

      router.replace("/");

      return;
    }

    // Otherwise we'll create a new entry
    await insertEntry.mutateAsync({
      meal_id: null,
      serving: returnedServing,
      product_id: product.uuid,
      created_at: returnedCreated,
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
      serving,
      product_id: product.uuid,
      created_at: new Date(),
    });

    router.replace("/");
  };

  return (
    <PageProduct
      product={product}
      serving={serving}
      created={entry?.created_at}
      createdVisible={true}
      onSave={handleSave}
      onDelete={entry ? handleDelete : undefined}
      onRepeat={entry ? handleRepeat : undefined}
    />
  );
}
