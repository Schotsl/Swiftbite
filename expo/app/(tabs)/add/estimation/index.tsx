import entryData from "@/queries/entryData";

import { Product } from "@/types/product";
import { useQuery } from "@tanstack/react-query";
import { ServingData } from "@/schemas/serving";
import { transformImage } from "@/helper";
import { useLocalSearchParams, useRouter } from "expo-router";

import useDeleteEntry from "@/mutations/useDeleteEntry";
import useInsertEntry from "@/mutations/useInsertEntry";
import PageEstimation from "@/components/Page/Estimation";
import useUpdateEntry from "@/mutations/useUpdateEntry";

import PageEstimationLoading from "@/components/Page/Estimation/Loading";

export default function AddEstimation() {
  const router = useRouter();

  const deleteEntry = useDeleteEntry();
  const insertEntry = useInsertEntry();
  const updateEntry = useUpdateEntry();

  const {
    uri,
    width,
    height,
    entry: entryId,
  } = useLocalSearchParams<{
    uri?: string;
    width?: string;
    height?: string;
    entry?: string;
  }>();

  const { data: entry, isLoading } = useQuery({
    // Less than ideal but if the query is enabled we know that the entryId is defined
    ...entryData({ uuid: entryId! }),
    select: (entries) => entries[0],
    enabled: !!entryId,
  });

  if (isLoading) {
    return <PageEstimationLoading editing={!!entry} />;
  }

  const image = transformImage(uri, width, height);
  const product = entry?.product;

  const handleSave = async (
    returnedProduct: Product,
    returnedServing: ServingData | null,
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
      product_id: returnedProduct.uuid,
      created_at: returnedCreated,
    });

    router.replace("/");
  };

  const handleDelete = async () => {
    if (!product) {
      return;
    }

    await deleteEntry.mutateAsync(entry);

    router.replace("/");
  };

  const handleDuplicate = async (serving: ServingData) => {
    if (!product) {
      return;
    }

    await insertEntry.mutateAsync({
      serving,
      meal_id: null,
      product_id: product.uuid,
    });

    router.replace("/");
  };

  return (
    <PageEstimation
      image={image}
      product={product}
      created={entry?.created_at}
      onSave={handleSave}
      onDelete={product ? handleDelete : undefined}
      onDuplicate={product ? handleDuplicate : undefined}
    />
  );
}
