import { useSuspenseQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { SwipeListView } from "react-native-swipe-list-view";

import HealthCalories from "../../components/HealthCalories";
import HealthWeight from "../../components/HealthWeight";
import Item from "../../components/Item";
import ItemDelete from "../../components/ItemDelete";
import useDeleteIngredient from "../../mutations/useDeleteIngredient";
import ingredientData from "../../queries/ingredientData";

export default function Index() {
  const [interval, setInterval] = useState<number | false>(1000);
  const deleteIngredient = useDeleteIngredient();

  const { data } = useSuspenseQuery({
    ...ingredientData(),
    refetchInterval: interval,
  });

  // If any of the titles or calories are missing we'll keep polling
  useEffect(() => {
    const processing = data.some(
      (item) => !item.title || !item.calorie_100g || !item.icon_id,
    );

    const interval = processing ? 500 : false;

    setInterval(interval);
  }, [data]);

  const handleDelete = (uuid: string) => {
    deleteIngredient.mutate(uuid);
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
