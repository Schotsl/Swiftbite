import variables from "@/variables";
import React, { useState } from "react";

import { View } from "react-native";
import { useForm } from "react-hook-form";
import { ScrollView } from "react-native-gesture-handler";
import { zodResolver } from "@hookform/resolvers/zod";
import { statsSchema, StatsData } from "@/schemas/stats";

import Tabs from "@/components/Tabs";
import PageStatsChartsHistory from "@/components/Page/Stats/Charts/History";
import PageStatsChartsPattern from "@/components/Page/Stats/Charts/Pattern";

export default function Stats() {
  const [tab, setTab] = useState("history");

  const end = new Date();
  const endDays = end.getDate();

  const start = new Date();

  start.setDate(endDays - 7);

  const { control } = useForm<StatsData>({
    resolver: zodResolver(statsSchema),
    defaultValues: { date: { start, end } },
  });

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
            <PageStatsChartsHistory control={control} />
          ) : (
            <PageStatsChartsPattern control={control} />
          )}
        </View>
      </ScrollView>
    </View>
  );
}
