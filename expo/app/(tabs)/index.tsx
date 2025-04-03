import { useSuspenseQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { SwipeListView } from "react-native-swipe-list-view";

import HealthCalories from "../../components/HealthCalories";
import HealthWeight from "../../components/HealthWeight";
import Item from "../../components/Item";
import ItemDelete from "../../components/ItemDelete";
import useDeleteEntry from "../../mutations/useDeleteEntry";
import entryData from "../../queries/entryData";

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
        !entry.ingredient?.title ||
        !entry.ingredient?.calorie_100g ||
        !entry.ingredient?.icon_id ||
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
        flex: 1,
        backgroundColor: "#F9F9F9",
      }}
    >
      <View
        style={{
          gap: 8,
          padding: 8,
          flexDirection: "row",
        }}
      >
        <HealthCalories />
        <HealthWeight />
      </View>

      <SwipeListView
        data={data}
        keyExtractor={(item) => item.uuid}
        renderItem={({ item }) => <Item {...item} />}
        renderHiddenItem={({ item }) => (
          <ItemDelete onDelete={() => handleDelete(item.uuid)} />
        )}
        rightOpenValue={-75}
        useNativeDriver
        disableRightSwipe
      />
    </View>
  );
}
