import { View } from "react-native";
import { getRange } from "@/helper";
import { useRouter } from "expo-router";
import { ScrollView } from "react-native-gesture-handler";
import { SwipeListView } from "react-native-swipe-list-view";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Product } from "@/types/product";
import { EntryWithMeal, EntryWithProduct } from "@/types";
import { Fragment, useEffect, useMemo, useState } from "react";

import entryData from "@/queries/entryData";
import useDeleteEntry from "@/mutations/useDeleteEntry";

import HomeWeek from "@/components/Home/Week";
import HomeStreak from "@/components/Home/Streak";
import HomeMacros from "@/components/Home/Macros";
import HeaderTitle from "@/components/Header/Title";

import ItemHeader from "@/components/Item/Header";
import ItemDelete from "@/components/Item/Delete";
import ItemProduct from "@/components/Item/Product";

export default function Index() {
  const router = useRouter();

  const [date, setDate] = useState<Date>(new Date());
  const [interval, setInterval] = useState<number | false>(1000);

  const deleteEntry = useDeleteEntry();

  const { startDate, endDate } = getRange(date);

  const { data } = useSuspenseQuery({
    ...entryData<EntryWithProduct | EntryWithMeal>(),
    refetchInterval: interval,
    select: (entries) => {
      const end = endDate.getTime();
      const start = startDate.getTime();

      return entries.filter((entry) => {
        const entryTime = new Date(entry.created_at).getTime();
        return entryTime >= start && entryTime <= end;
      });
    },
  });

  // If any of the titles, calories, or consumed quantities are missing we'll keep polling
  useEffect(() => {
    const processing = data.some((entry) => entry.product?.processing);
    const interval = processing ? 500 : false;

    setInterval(interval);
  }, [data]);

  const sections = useMemo(() => {
    const sections = [
      {
        title: "Night",
        subtitle: "21:00 - 06:00",
        startHour: 21,
        data: [] as (EntryWithProduct | EntryWithMeal)[],
      },
      {
        title: "Evening",
        subtitle: "17:00 - 21:00",
        startHour: 17,
        data: [] as (EntryWithProduct | EntryWithMeal)[],
      },
      {
        title: "Afternoon",
        subtitle: "12:00 - 17:00",
        startHour: 12,
        data: [] as (EntryWithProduct | EntryWithMeal)[],
      },
      {
        title: "Morning",
        subtitle: "06:00 - 12:00",
        startHour: 6,
        data: [] as (EntryWithProduct | EntryWithMeal)[],
      },
    ];

    const currentDate = new Date();
    const currentHour = currentDate.getHours();

    // Filter sections based on the current time
    const sectionsFiltered = sections.filter(
      (section) => currentHour >= section.startHour,
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

        <HomeWeek date={date} onPress={setDate} />

        <HomeMacros />

        <HeaderTitle>Logs</HeaderTitle>
      </View>

      <SwipeListView
        style={{ marginBottom: -2 }}
        sections={sections}
        renderItem={({ item }) => {
          return item.product ? (
            <ItemProduct
              product={item.product as Product}
              serving={item.serving}
              onSelect={() => {
                router.push({
                  pathname:
                    item.product?.type === "manual"
                      ? "/(tabs)/add/add-estimation"
                      : "/(tabs)/add/add-product",
                  params: {
                    entry: item.uuid,
                  },
                });
              }}
            />
          ) : (
            // <ItemMeal
            //   // meal={item.meal!}
            //   onPress={() => {
            //     router.push({
            //       pathname: "/(tabs)/add/add-meal",
            //       params: { entry: item.uuid },
            //     });
            //   }}
            // />
            <Fragment />
          );
        }}
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
