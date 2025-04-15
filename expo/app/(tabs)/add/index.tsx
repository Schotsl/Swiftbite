import { useSuspenseQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { SwipeListView } from "react-native-swipe-list-view";

import Item from "@/components/Item";
import ItemDelete from "@/components/ItemDelete";
import useDeleteEntry from "@/mutations/useDeleteEntry";
import entryData from "@/queries/entryData";

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
        !entry.consumed_quantity,
    );

    const interval = processing ? 500 : false;

    setInterval(interval);
  }, [data]);

  const handleDelete = (uuid: string) => {
    deleteEntry.mutate(uuid);
  };

  return (
    <View
      style={{
        height: "100%",
        borderColor: "#000000",
        borderWidth: 2,
        borderLeftWidth: 0,
        borderBottomWidth: 0,
        borderRightWidth: 0,
      }}
    >
      <SwipeListView
        data={data}
        keyExtractor={(item) => item.uuid}
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
        onRowDidOpen={(rowKey, rowMap) => {
          setTimeout(() => {
            rowMap[rowKey]?.closeRow();
          }, 500);
        }}
        rightOpenValue={-75}
        useNativeDriver
        disableRightSwipe
      />
    </View>
  );
}
