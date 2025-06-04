import { Entry } from "@/types/entry";
import { rowTimeout } from "@/helper";
import { ScrollView, View } from "react-native";

import { Href, router } from "expo-router";
import { SwipeListView } from "react-native-swipe-list-view";
import { Suspense, useEffect, useState } from "react";

import language from "@/language";
import variables from "@/variables";

import entryData from "@/queries/entryData";
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
import useDuplicateEntry from "@/mutations/useDuplicateEntry";

type Section = {
  data: Entry[];
  title: string;
  subtitle: string;
  startHour: number;
};

const getSections = (entries: Entry[]): Section[] => {
  const sections: Section[] = [
    {
      data: [],
      title: language.time.night.label,
      subtitle: language.time.night.range,
      startHour: 21,
    },
    {
      data: [],
      title: language.time.evening.label,
      subtitle: language.time.evening.range,
      startHour: 17,
    },
    {
      data: [],
      title: language.time.afternoon.label,
      subtitle: language.time.afternoon.range,
      startHour: 12,
    },
    {
      data: [],
      title: language.time.morning.label,
      subtitle: language.time.morning.range,
      startHour: 6,
    },
  ];

  // Populate active sections with data
  entries?.forEach((entry) => {
    const entryDate = new Date(entry.created_at);
    const entryHour = entryDate.getHours();

    let targetSection;

    if (entryHour >= 6 && entryHour < 12) {
      targetSection = sections.find(
        (s) => s.title === language.time.morning.label,
      );
    } else if (entryHour >= 12 && entryHour < 17) {
      targetSection = sections.find(
        (s) => s.title === language.time.afternoon.label,
      );
    } else if (entryHour >= 17 && entryHour < 21) {
      targetSection = sections.find(
        (s) => s.title === language.time.evening.label,
      );
    } else {
      targetSection = sections.find(
        (s) => s.title === language.time.night.label,
      );
    }

    if (targetSection) {
      targetSection.data.push(entry);
    }
  });

  // Sort the active sections chronologically for display
  sections.sort((a, b) => b.startHour - a.startHour);

  // Filter out the sections with no data
  const sectionsFiltered = sections.filter(({ data }) => data.length > 0);

  return sectionsFiltered;
};

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
        marginBottom: -1,
        backgroundColor: empty
          ? variables.colors.greyBackground
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

        <TextTitle>{language.page.add.title}</TextTitle>
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
  const duplicateEntry = useDuplicateEntry();

  const [interval, setInterval] = useState<number | false>(1000);

  const { data: entries } = useSuspenseQueryFocus({
    ...entryData({ date }),
    refetchInterval: interval,
  });

  const sections = getSections(entries);

  useEffect(() => {
    // If any icon_id is null then it's still processing
    const processingIcon = entries.some(({ product, meal }) => {
      return !product?.icon_id && !meal?.icon_id;
    });

    const processingProduct = entries.some(
      ({ product }) => product?.processing,
    );

    const processingMeal = entries.some(({ meal }) =>
      meal?.meal_products?.some(
        (mealProduct) => mealProduct.product?.processing,
      ),
    );

    const processing = processingIcon || processingProduct || processingMeal;
    const interval = processing ? 500 : false;

    setInterval(interval);
  }, [entries]);

  useEffect(() => {
    onEmpty(entries.length === 0);
  }, [entries, onEmpty]);

  const handleDelete = (entry: Entry) => {
    deleteEntry.mutate(entry);
  };

  const handleDuplicate = (entry: Entry) => {
    duplicateEntry.mutate(entry);
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
      style={{
        borderTopColor: variables.border.color,
        borderTopWidth: 1,
      }}
      renderItem={({ item }) => (
        <AddListItem entry={item} handleSelect={handleSelect} />
      )}
      renderHiddenItem={({ item }) => (
        <ItemActions
          onDelete={() => handleDelete(item)}
          onDuplicate={item.serving ? () => handleDuplicate(item) : undefined}
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
      <ItemHeader
        title={language.time.morning.label}
        subtitle={language.time.morning.range}
      />
      <View
        style={{
          minHeight: 180,
          backgroundColor: variables.colors.greyBackground,
          borderTopWidth: variables.border.width,
          borderTopColor: variables.border.color,
        }}
      >
        <Empty emoji={"😶"} content={language.page.add.empty} />
      </View>
    </View>
  );
}

function AddListLoading() {
  return (
    <View>
      <ItemHeader
        title={language.time.morning.label}
        subtitle={language.time.morning.range}
      />
      <ItemSkeleton />
      <ItemSkeleton />
      <ItemSkeleton />
      <ItemSkeleton />
    </View>
  );
}
