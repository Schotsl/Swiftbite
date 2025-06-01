import variables from "@/variables";
import React, { useState } from "react";

import { View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import Tabs from "@/components/Tabs";
import PageStatsChartsHistory from "@/components/Page/Stats/Charts/History";
import PageStatsChartsPattern from "@/components/Page/Stats/Charts/Pattern";

export default function Stats() {
  const [tab, setTab] = useState("history");

  return (
    <View>
      <Tabs
        tabs={[
          {
            title: "Geschiedenis",
            value: "history",
          },
          {
            title: "Patronen",
            value: "patterns",
          },
        ]}
        value={tab}
        onSelect={setTab}
      />

      <ScrollView>
        <View
          style={{
            minHeight: "100%",

            gap: variables.gap.normal,
            padding: variables.padding.page,
            paddingBottom: variables.paddingTab,
          }}
        >
          {tab === "history" ? (
            <PageStatsChartsHistory />
          ) : (
            <PageStatsChartsPattern />
          )}
        </View>
      </ScrollView>
    </View>
  );
}
