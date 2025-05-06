import { useState } from "react";
import { ScrollView } from "react-native";

import Tabs from "@/components/Tabs";
import PageEstimationAutomatic from "@/components/Page/Estimation/Automatic";
import PageEstimationManual from "@/components/Page/Estimation/Manual";

export default function Add2Preview() {
  const [tab, setTab] = useState("automatic");

  return (
    <ScrollView>
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

      {tab === "automatic" ? (
        <PageEstimationAutomatic />
      ) : (
        <PageEstimationManual />
      )}
    </ScrollView>
  );
}
