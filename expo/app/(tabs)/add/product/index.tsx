import entryData from "@/queries/entryData";
import useInsertEntry from "@/mutations/useInsertEntry";
import useUpdateEntry from "@/mutations/useUpdateEntry";
import useDeleteEntry from "@/mutations/useDeleteEntry";

import Empty from "@/components/Empty";
import PageProduct from "@/components/Page/Product";
import HeaderLoading from "@/components/Header/Loading";

import { View } from "react-native";
import { useProduct } from "@/hooks/useProduct";
import { useQuery } from "@tanstack/react-query";
import { ServingData } from "@/schemas/serving";
import { useLocalSearchParams, Redirect, useRouter } from "expo-router";

import language from "@/language";

export default function AddProduct() {
  const router = useRouter();

  const insertEntry = useInsertEntry();
  const updateEntry = useUpdateEntry();
  const deleteEntry = useDeleteEntry();

  const {
    entry: entryId,
    product: productId,
    barcode: barcodeId,
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

  const { product: productObject, isLoading: isLoadingProduct } = useProduct({
    productId,
    barcodeId,
    enabled: !entryId,
    redirect: "/(tabs)/add/search",
  });

  if (isLoadingEntry || isLoadingProduct) {
    return (
      <View style={{ padding: 32, minHeight: "100%" }}>
        <HeaderLoading />

        <Empty
          emoji="🔎"
          active={true}
          content={language.types.product.loading}
        />
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
    returnedCreated: Date
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
