import Tabs from "@/components/Tabs";
import PageEstimationManual from "./Manual";
import PageEstimationAutomatic from "./Automatic";

import language from "@/language";

import { View } from "react-native";
import { Image } from "@/types";
import { Product } from "@/types/product";
import { useState } from "react";
import { ServingData } from "@/schemas/serving";

type PageEstimationProps = {
  image?: Image | null;
  product?: Product;
  created?: Date;
  onDelete?: () => void;
  onDuplicate?: (serving: ServingData) => void;
  onSave: (
    product: Product,
    serving: ServingData | null,
    created: Date,
  ) => void;
};

export default function PageEstimation({
  image,
  product,
  created,
  onSave,
  onDelete,
  onDuplicate,
}: PageEstimationProps) {
  const [tab, setTab] = useState(product ? "manual" : "automatic");

  const tabVisible = !image && !product;

  return (
    <View style={{ maxHeight: "100%" }}>
      {tabVisible && (
        <Tabs
          tabs={[
            {
              title: language.page.estimation.automatic.tab,
              value: "automatic",
            },
            {
              title: language.page.estimation.manual.tab,
              value: "manual",
            },
          ]}
          value={tab}
          onSelect={setTab}
        />
      )}

      {tab === "automatic" ? (
        <PageEstimationAutomatic tab={tabVisible} onSave={onSave} />
      ) : (
        <PageEstimationManual
          product={product}
          created={created}
          createdVisible={true}
          onSave={onSave}
          onDelete={onDelete}
          onDuplicate={onDuplicate}
        />
      )}
    </View>
  );
}
