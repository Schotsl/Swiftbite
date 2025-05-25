import { View } from "react-native";
import { Entry } from "@/types/entry";
import { ScrollView } from "react-native-gesture-handler";
import { getSections } from "./helper";
import { Href, router } from "expo-router";
import { SwipeListView } from "react-native-swipe-list-view";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Suspense, useEffect, useState } from "react";

import language from "@/language";
import variables from "@/variables";

import entryData from "@/queries/entryData";
import useDeleteEntry from "@/mutations/useDeleteEntry";

import HomeWeek from "@/components/Home/Week";
import HomeTitle from "@/components/Home/Title";
import HomeStreak from "@/components/Home/Streak";
import HomeMacros from "@/components/Home/Macros";
import TextTitle from "@/components/Text/Title";

import ItemMeal from "@/components/Item/Meal";
import ItemHeader from "@/components/Item/Header";
import ItemDelete from "@/components/Item/Delete";
import ItemProduct from "@/components/Item/Product";
import ItemSkeleton from "@/components/Item/Skeleton";

export default function Add() {
  const [date, setDate] = useState<Date>(new Date());
  const [interval, setInterval] = useState<number | false>(1000);

  const { data } = useSuspenseQuery({
    ...entryData({ date }),
    refetchInterval: interval,
  });

  // If any of the entries are processing we'll keep polling
  useEffect(() => {
    const processingProduct = data.some((entry) => entry.product?.processing);
    const processingMeal = data.some((entry) =>
      entry.meal?.meal_products?.some(
        (mealProduct) => mealProduct.product?.processing,
      ),
    );

    const interval = processingProduct || processingMeal ? 500 : false;

    setInterval(interval);
  }, [data]);

  return (
    <ScrollView
      style={{
        minHeight: "100%",
      }}
    >
      <View
        style={{
          gap: variables.gap.large,
          padding: variables.padding.page,
        }}
      >
        <View style={{ gap: 32 }}>
          <View
            style={{
              alignItems: "center",
              alignContent: "center",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <HomeTitle date={date} />

            <HomeStreak />
          </View>

          <HomeWeek date={date} onPress={setDate} />
        </View>

        <HomeMacros date={date} />

        <TextTitle>Logs</TextTitle>
      </View>

      <Suspense fallback={<AddListLoading />}>
        <AddList entries={data} />
      </Suspense>
    </ScrollView>
  );
}

type AddListProps = {
  entries: Entry[];
};

function AddList({ entries }: AddListProps) {
  const deleteEntry = useDeleteEntry();

  const handleDelete = (uuid: string) => {
    deleteEntry.mutate(uuid);
  };

  const handleSelect = (entry: string, type: string) => {
    let pathname: Href = "/(tabs)/add/product";

    if (type === "meal") {
      pathname = "/(tabs)/add/meal";
    }

    if (type === "manual") {
      pathname = "/(tabs)/add/estimation";
    }

    router.push({
      params: { entry },
      pathname,
    });
  };

  const sections = getSections(entries);

  return (
    <SwipeListView
      sections={sections}
      renderItem={({ item }) => (
        <AddListItem entry={item} handleSelect={handleSelect} />
      )}
      renderHiddenItem={({ item }) => (
        <ItemDelete onDelete={() => handleDelete(item.uuid)} />
      )}
      renderSectionHeader={({ section }) => (
        <ItemHeader title={section.title} subtitle={section.subtitle} />
      )}
      scrollEnabled={false}
      rightOpenValue={-75}
      useSectionList={true}
      disableRightSwipe={true}
      ListEmptyComponent={<AddListEmpty />}
    />
  );
}

type AddListItemProps = {
  entry: Entry;
  handleSelect: (uuid: string, type: string) => void;
};

function AddListItem({ entry, handleSelect }: AddListItemProps) {
  const { meal, serving, product } = entry;

  if (product) {
    return (
      <ItemProduct
        product={product}
        serving={serving}
        onSelect={() => handleSelect(entry.uuid, entry.product.type)}
      />
    );
  }

  return (
    <ItemMeal
      meal={meal}
      serving={serving}
      onSelect={() => handleSelect(entry.uuid, "meal")}
    />
  );
}

function AddListEmpty() {
  return (
    <View>
      <ItemHeader title={language.time.morning} subtitle="06:00 - 12:00" />
    </View>
  );
}

function AddListLoading() {
  return (
    <View>
      <ItemHeader title={language.time.morning} subtitle="06:00 - 12:00" />
      <ItemSkeleton />
      <ItemSkeleton />
      <ItemSkeleton />
      <ItemSkeleton />
    </View>
  );
}
