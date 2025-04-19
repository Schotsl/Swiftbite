import { useSuspenseQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { RowMap, SwipeListView } from "react-native-swipe-list-view";

import Item from "@/components/Item";
import ItemDelete from "@/components/Item/Delete";
import useDeleteEntry from "@/mutations/useDeleteEntry";
import entryData from "@/queries/entryData";
import Header from "@/components/Header";
import HomeStreak from "@/components/Home/Streak";
import HeaderTitle from "@/components/Header/Title";
import HomeDate from "@/components/Home/Date";
import HomeCircle from "@/components/Home/Progress";
import Progress from "@/components/Progress";
import ItemHeader from "@/components/Item/Header";
import { ScrollView } from "react-native-gesture-handler";
import { rowTimeout } from "@/helper";
import { EntryWithProduct } from "@/types";

export default function Index() {
  const [interval, setInterval] = useState<number | false>(1000);

  const deleteEntry = useDeleteEntry();

  const { data } = useSuspenseQuery({
    ...entryData({}),
    refetchInterval: interval,
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
        sections={[
          { title: "Morning", subtitle: "09:00 - 12:00", data: data },
          { title: "Afternoon", subtitle: "12:00 - 15:00", data: data },
          { title: "Evening", subtitle: "15:00 - 18:00", data: data },
        ]}
        renderItem={({ item }) => {
          const quantity = item.consumed_quantity || 0;
          const multiplier = item.product.calorie_100g || 0;

          const calories = (multiplier / 100) * quantity;
          const caloriesRounded = Math.round(calories);

          return (
            <Item
              title={item.product.title || "Loading..."}
              iconId={item.product.icon_id}
              subtitle={item.product.brand || "Loading..."}
              rightBottom={`${caloriesRounded} kcal`}
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
    </ScrollView>
  );
}
