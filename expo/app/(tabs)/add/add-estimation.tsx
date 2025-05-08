import Tabs from "@/components/Tabs";
import entryData from "@/queries/entryData";

import PageEstimationManual from "@/components/Page/Estimation/Manual";
import PageEstimationAutomatic from "@/components/Page/Estimation/Automatic";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { transformImage } from "@/helper";
import { useLocalSearchParams } from "expo-router";
import { EntryWithProductManual } from "@/types";
import { View } from "react-native";

export default function Add2Preview() {
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
  });

  const image = transformImage(uri, width, height);
  const product = entry?.product;

  const [tab, setTab] = useState(product ? "manual" : "automatic");

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
        <PageEstimationManual product={product} />
      )}
    </View>
  );
}
