import Tabs from "@/components/Tabs";
import PageEstimationManual from "./Manual";
import PageEstimationAutomatic from "./Automatic";

import { View } from "react-native";
import { Image } from "@/types";
import { Product } from "@/types/product";
import { useState } from "react";
import { ServingData } from "@/schemas/serving";

type PageEstimationProps = {
  image?: Image | null;
  product?: Product;
  onDelete?: () => void;
  onRepeat?: (serving: ServingData) => void;
};

export default function PageEstimation({
  image,
  product,
  onDelete,
  onRepeat,
}: PageEstimationProps) {
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
        <PageEstimationManual
          product={product}
          onDelete={onDelete}
          onRepeat={onRepeat}
        />
      )}
    </View>
  );
}
