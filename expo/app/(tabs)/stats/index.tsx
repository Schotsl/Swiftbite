import variables from "@/variables";
import React, { useEffect, useState } from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, ScrollView, View } from "react-native";
import { statsSchema, StatsData } from "@/schemas/stats";

import Tabs from "@/components/Tabs";
import PageStatsChartsHistory from "@/components/Page/Stats/Charts/History";
import PageStatsChartsPattern from "@/components/Page/Stats/Charts/Pattern";

import language from "@/language";

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

  useEffect(() => {
    Alert.alert(language.alert.demo.title, language.alert.demo.subtitle);
  }, []);

  return (
    <View>
      <Tabs
        tabs={[
          {
            title: language.page.stats.charts.history.title,
            value: "history",
          },
          {
            title: language.page.stats.charts.pattern.title,
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
