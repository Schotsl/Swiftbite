import Tabs from "@/components/Tabs";
import entryData from "@/queries/entryData";

import PageEstimationManual from "@/components/Page/Estimation/Manual";
import PageEstimationAutomatic from "@/components/Page/Estimation/Automatic";

import { View } from "react-native";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { transformImage } from "@/helper";
import { useLocalSearchParams, useRouter } from "expo-router";
import { EntryWithProductManual } from "@/types";
import useDeleteEntry from "@/mutations/useDeleteEntry";
import useInsertEntry from "@/mutations/useInsertEntry";
import { ServingData } from "@/schemas/serving";

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
    ...entryData<EntryWithProductManual>({}),
    select: (entries) => entries.find((entry) => entry.uuid === entryId),
    enabled: !!entryId,
  });

  const image = transformImage(uri, width, height);
  const product = entry?.product;

  const [tab, setTab] = useState(product ? "manual" : "automatic");

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
      meal_id: null,
      product_id: product.uuid,
      consumed_gram: serving.gram,
      consumed_option: serving.option,
      consumed_quantity: serving.quantity,
    });

    router.replace("/");
  };

  return (
    <View>
      {!image && !product && (
        <Tabs
          tabs={[
            {
              title: "Automatisch",
              value: "automatic",
            },
            {
              title: "Handmatig",
              value: "manual",
            },
          ]}
          value={tab}
          onSelect={setTab}
        />
      )}

      {tab === "automatic" ? (
        <PageEstimationAutomatic />
      ) : (
        <PageEstimationManual
          product={product}
          onDelete={product ? handleDelete : undefined}
          onRepeat={product ? handleRepeat : undefined}
        />
      )}
    </View>
  );
}
