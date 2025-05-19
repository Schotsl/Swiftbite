import entryData from "@/queries/entryData";

import { useQuery } from "@tanstack/react-query";
import { ServingData } from "@/schemas/serving";
import { transformImage } from "@/helper";
import { useLocalSearchParams, useRouter } from "expo-router";

import useDeleteEntry from "@/mutations/useDeleteEntry";
import useInsertEntry from "@/mutations/useInsertEntry";
import PageEstimation from "@/components/Page/Estimation";

export default function Add2Preview() {
  const router = useRouter();

  const deleteEntry = useDeleteEntry();
  const insertEntry = useInsertEntry();

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

  const { data: entry } = useQuery({
    // Less than ideal but if the query is enabled we know that the entryId is defined
    ...entryData({ uuid: entryId as string }),
    select: (entries) => entries[0],
    enabled: !!entryId,
  });

  const image = transformImage(uri, width, height);
  const product = entry?.product;

  const handleDelete = async () => {
    if (!product) {
      return;
    }

    await deleteEntry.mutateAsync(entry.uuid);

    router.replace("/");
  };

  const handleRepeat = async (serving: ServingData) => {
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
      onDelete={product ? handleDelete : undefined}
      onRepeat={product ? handleRepeat : undefined}
    />
  );
}
