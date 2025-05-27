import { View } from "react-native";
import { Entry } from "@/types/entry";
import { rowTimeout } from "@/helper";

import { ScrollView } from "react-native-gesture-handler";
import { getSections } from "./helper";
import { Href, router } from "expo-router";
import { SwipeListView } from "react-native-swipe-list-view";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Suspense, useEffect, useState } from "react";

import language from "@/language";
import variables from "@/variables";

import entryData from "@/queries/entryData";
import useInsertEntry from "@/mutations/useInsertEntry";
import useDeleteEntry from "@/mutations/useDeleteEntry";

import Empty from "@/components/Empty";
import HomeWeek from "@/components/Home/Week";
import HomeTitle from "@/components/Home/Title";
import HomeStreak from "@/components/Home/Streak";
import HomeMacros from "@/components/Home/Macros";
import TextTitle from "@/components/Text/Title";

import ItemMeal from "@/components/Item/Meal";
import ItemHeader from "@/components/Item/Header";
import ItemActions from "@/components/Item/Actions";
import ItemProduct from "@/components/Item/Product";
import ItemSkeleton from "@/components/Item/Skeleton";
import useSuspenseQueryFocus from "@/hooks/useSuspenseQueryFocus";

export default function Add() {
  const [date, setDate] = useState<Date>(new Date());
  const [empty, setEmpty] = useState<boolean>(false);

  const handleEmpty = (empty: boolean) => {
    setEmpty(empty);
  };

  return (
    <ScrollView
      style={{
        minHeight: "100%",
        backgroundColor: empty
          ? variables.colors.greyLight
          : variables.colors.white,
      }}
    >
      <View
        style={{
          gap: variables.gap.large,
          padding: variables.padding.page,
          backgroundColor: variables.colors.white,
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
        <AddList date={date} onEmpty={handleEmpty} />
      </Suspense>
    </ScrollView>
  );
}

type AddListProps = {
  date: Date;
  onEmpty: (empty: boolean) => void;
};

function AddList({ date, onEmpty }: AddListProps) {
  const deleteEntry = useDeleteEntry();
  const insertEntry = useInsertEntry();

  const [interval, setInterval] = useState<number | false>(1000);

  const { data: entries } = useSuspenseQueryFocus({
    ...entryData({ date }),
    refetchInterval: interval,
  });

  const sections = getSections(entries);

  useEffect(() => {
    // If any icon_id is null then it's still processing
    const processingIcon = entries.some(({ product }) => !product?.icon_id);
    const processingProduct = entries.some(
      ({ product }) => product?.processing
    );
    const processingMeal = entries.some(({ meal }) =>
      meal?.meal_products?.some(
        (mealProduct) => mealProduct.product?.processing
      )
    );

    const processing = processingIcon || processingProduct || processingMeal;
    const interval = processing ? 500 : false;

    setInterval(interval);
  }, [entries]);

  useEffect(() => {
    onEmpty(entries.length === 0);
  }, [entries, onEmpty]);

  const handleDelete = (uuid: string) => {
    deleteEntry.mutate(uuid);
  };

  const handleRepeat = (entry: Entry) => {
    const { meal_id, product_id, serving } = entry;

    insertEntry.mutate({
      meal_id,
      product_id,
      serving,
    });
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

  return (
    <SwipeListView
      sections={sections}
      keyExtractor={(item) => item.uuid}
      renderItem={({ item }) => (
        <AddListItem entry={item} handleSelect={handleSelect} />
      )}
      renderHiddenItem={({ item }) => (
        <ItemActions
          onDelete={() => handleDelete(item.uuid)}
          onRepeat={item.serving ? () => handleRepeat(item) : undefined}
        />
      )}
      renderSectionHeader={({ section }) => (
        <ItemHeader title={section.title} subtitle={section.subtitle} />
      )}
      ListEmptyComponent={<AddListEmpty />}
      onRowDidOpen={rowTimeout}
      scrollEnabled={false}
      rightOpenValue={-150}
      useSectionList={true}
      closeOnRowOpen={true}
      disableRightSwipe={true}
      // Create a quick preview of the first entry
      previewRowKey={entries.length > 0 ? entries[0].uuid : undefined}
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
      <View
        style={{
          minHeight: 180,
          backgroundColor: variables.colors.greyLight,
          borderTopWidth: variables.border.width,
          borderTopColor: variables.border.color,
        }}
      >
        {/* TODO: language */}
        <Empty
          emoji="😶"
          content="Op dit moment heb je nog geen logs toegevoegd aan deze dag"
        />
      </View>
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
