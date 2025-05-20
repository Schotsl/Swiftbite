import { View } from "react-native";
import { Entry } from "@/types/entry";
import { Product } from "@/types/product";
import { ScrollView } from "react-native-gesture-handler";
import { Href, router } from "expo-router";
import { transformDate } from "@/helper";
import { SwipeListView } from "react-native-swipe-list-view";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Suspense, useEffect, useMemo, useState } from "react";

import entryData from "@/queries/entryData";
import useDeleteEntry from "@/mutations/useDeleteEntry";

import HomeWeek from "@/components/Home/Week";
import HomeStreak from "@/components/Home/Streak";
import HomeMacros from "@/components/Home/Macros";
import HeaderTitle from "@/components/Header/Title";

import ItemHeader from "@/components/Item/Header";
import ItemDelete from "@/components/Item/Delete";
import ItemProduct from "@/components/Item/Product";
import ItemSkeleton from "@/components/Item/Skeleton";
import ItemMeal from "@/components/Item/Meal";

export default function Add() {
  const [date, setDate] = useState<Date>(new Date());
  const [interval, setInterval] = useState<number | false>(1000);

  const { data } = useSuspenseQuery({
    ...entryData({ date }),
    refetchInterval: interval,
  });

  // If any of the entries are processing we'll keep polling
  useEffect(() => {
    const processing = data?.some((entry) => entry.product?.processing);
    const interval = processing ? 500 : false;

    setInterval(interval);
  }, [data]);

  // If date is today then we'll return "Vandaag", ortherwise we'll turn the date to a locale string
  const labelDate = transformDate(date);
  const labelToday = transformDate(new Date());

  const isToday = labelDate === labelToday;

  const label = isToday ? "Vandaag" : labelDate;

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
          <HeaderTitle>{label}</HeaderTitle>

          <HomeStreak />
        </View>

        <HomeWeek date={date} onPress={setDate} />

        <HomeMacros date={date} />

        <HeaderTitle>Logs</HeaderTitle>
      </View>

      <Suspense fallback={<AddListLoading />}>
        <AddList entries={data} today={isToday} />
      </Suspense>
    </ScrollView>
  );
}

type AddListProps = {
  today: boolean;
  entries: Entry[];
};

function AddList({ entries, today }: AddListProps) {
  const deleteEntry = useDeleteEntry();

  const handleDelete = (uuid: string) => {
    deleteEntry.mutate(uuid);
  };

  const handleSelect = (entry: string, type: string) => {
    let pathname: Href = "/(tabs)/add/add-product";

    if (type === "meal") {
      pathname = "/(tabs)/add/add-meal";
    }

    if (type === "manual") {
      pathname = "/(tabs)/add/add-estimation";
    }

    router.push({
      params: { entry },
      pathname,
    });
  };

  const sections = useMemo(() => {
    const sections = [
      {
        title: "Night",
        subtitle: "21:00 - 06:00",
        startHour: 21,
        data: [] as Entry[],
      },
      {
        title: "Evening",
        subtitle: "17:00 - 21:00",
        startHour: 17,
        data: [] as Entry[],
      },
      {
        title: "Afternoon",
        subtitle: "12:00 - 17:00",
        startHour: 12,
        data: [] as Entry[],
      },
      {
        title: "Morning",
        subtitle: "06:00 - 12:00",
        startHour: 6,
        data: [] as Entry[],
      },
    ];

    const currentDate = new Date();
    const currentHour = currentDate.getHours();

    // Filter sections based on the current time
    const sectionsFiltered = sections.filter(
      (section) => !today || currentHour >= section.startHour
    );

    // Populate active sections with data
    entries?.forEach((entry) => {
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
  }, [entries]);
  console.log(sections);
  return (
    <SwipeListView
      style={{ marginBottom: -2 }}
      sections={sections}
      renderItem={({ item }) => {
        return item.product ? (
          <ItemProduct
            product={item.product as Product}
            serving={item.serving}
            onSelect={() => handleSelect(item.uuid, item.product.type)}
          />
        ) : (
          <ItemMeal
            meal={item.meal}
            serving={item.serving}
            onSelect={() => handleSelect(item.uuid, "meal")}
          />
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
  );
}

function AddListLoading() {
  return (
    <View>
      <ItemHeader title="Morning" subtitle="06:00 - 12:00" />
      <ItemSkeleton />
      <ItemSkeleton />
      <ItemSkeleton />
      <ItemSkeleton />
    </View>
  );
}
