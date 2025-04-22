import { useSuspenseQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { View } from "react-native";
import { SwipeListView } from "react-native-swipe-list-view";

import Item from "@/components/Item";
import ItemDelete from "@/components/Item/Delete";
import useDeleteEntry from "@/mutations/useDeleteEntry";
import entryData from "@/queries/entryData";
import HomeStreak from "@/components/Home/Streak";
import HeaderTitle from "@/components/Header/Title";
import HomeDate from "@/components/Home/Date";
import HomeCircle from "@/components/Home/Progress";
import Progress from "@/components/Progress";
import ItemHeader from "@/components/Item/Header";
import { ScrollView } from "react-native-gesture-handler";
import { EntryWithProduct, Option } from "@/types";
import ItemEntry from "@/components/Item/Entry";

// Helper function to get today's start and end ISO strings
const getTodayRange = () => {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endOfDay = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    23,
    59,
    59,
    999
  );
  return {
    startDate: startOfDay.toISOString(),
    endDate: endOfDay.toISOString(),
  };
};

export default function Index() {
  const [interval, setInterval] = useState<number | false>(1000);

  const deleteEntry = useDeleteEntry();

  // Get today's date range
  const { startDate, endDate } = getTodayRange();

  const { data } = useSuspenseQuery({
    ...entryData({}),
    refetchInterval: interval,
    select: (entries) => {
      const start = new Date(startDate).getTime();
      const end = new Date(endDate).getTime();
      return entries.filter((entry) => {
        const entryTime = new Date(entry.created_at).getTime();
        return entryTime >= start && entryTime <= end;
      });
    },
  });

  // If any of the titles, calories, or consumed quantities are missing we'll keep polling
  useEffect(() => {
    const processing = data.some(
      (entry) =>
        !entry.product?.title ||
        !entry.product?.calorie_100g ||
        !entry.product?.icon_id ||
        !entry.consumed_quantity
    );

    const interval = processing ? 500 : false;

    setInterval(interval);
  }, [data]);

  const sections = useMemo(() => {
    const sections = [
      {
        title: "Night",
        subtitle: "21:00 - 06:00",
        startHour: 21,
        data: [] as EntryWithProduct[],
      },
      {
        title: "Evening",
        subtitle: "17:00 - 21:00",
        startHour: 17,
        data: [] as EntryWithProduct[],
      },
      {
        title: "Afternoon",
        subtitle: "12:00 - 17:00",
        startHour: 12,
        data: [] as EntryWithProduct[],
      },
      {
        title: "Morning",
        subtitle: "06:00 - 12:00",
        startHour: 6,
        data: [] as EntryWithProduct[],
      },
    ];

    const currentDate = new Date();
    const currentHour = currentDate.getHours();

    // Filter sections based on the current time
    const sectionsFiltered = sections.filter(
      (section) => currentHour >= section.startHour
    );

    // Populate active sections with data
    data.forEach((entry) => {
      const entryDate = new Date(entry.created_at);
      const entryHour = entryDate.getHours();

      let targetSection;

      if (entryHour >= 6 && entryHour < 12) {
        targetSection = sectionsFiltered.find((s) => s.title === "Morning");
      } else if (entryHour >= 12 && entryHour < 17) {
        targetSection = sectionsFiltered.find((s) => s.title === "Afternoon");
      } else if (entryHour >= 17 && entryHour < 21) {
        targetSection = sectionsFiltered.find((s) => s.title === "Evening");
      } else {
        targetSection = sectionsFiltered.find((s) => s.title === "Night");
      }

      if (targetSection) {
        targetSection.data.push(entry);
      }
    });

    // Sort the active sections chronologically for display
    sectionsFiltered.sort((a, b) => b.startHour - a.startHour);

    return sectionsFiltered;
  }, [data]);

  const handleDelete = (uuid: string) => {
    deleteEntry.mutate(uuid);
  };

  return (
    <ScrollView
      style={{
        minHeight: "100%",
      }}
    >
      <View
        style={{
          gap: 24,
          padding: 32,
          borderColor: "#000",
          borderBottomWidth: 2,
        }}
      >
        <View
          style={{
            alignContent: "center",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <HeaderTitle>Today</HeaderTitle>

          <HomeStreak />
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <HomeDate type="dashed" date={18} weekday="M" />
          <HomeDate type="dashed" date={19} weekday="D" />
          <HomeDate type="normal" date={20} weekday="W" />
          <HomeDate type="thick" date={21} weekday="D" />
          <HomeDate type="normal" date={22} weekday="F" />
          <HomeDate type="normal" date={22} weekday="S" />
          <HomeDate type="normal" date={31} weekday="S" />
        </View>

        <View style={{ gap: 16, paddingVertical: 24 }}>
          <HomeCircle target={1000} burned={100} consumed={100} />

          <View
            style={{
              gap: 16,
              width: "100%",

              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Progress label="Eiwitten" value={40} target={85} />
            <Progress label="Carbs" value={100} target={200} />
            <Progress label="Vetten" value={100} target={200} />
          </View>
        </View>

        <HeaderTitle>Logs</HeaderTitle>
      </View>

      <SwipeListView
        style={{ marginBottom: -2 }}
        sections={sections}
        renderItem={ItemEntry}
        renderHiddenItem={({ item }) => (
          <ItemDelete onDelete={() => handleDelete(item.uuid)} />
        )}
        renderSectionHeader={({ section }) => (
          <ItemHeader title={section.title} subtitle={section.subtitle} />
        )}
        scrollEnabled={false}
        rightOpenValue={-75}
        useSectionList
        disableRightSwipe
      />
    </ScrollView>
  );
}
