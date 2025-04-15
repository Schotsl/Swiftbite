import { useSuspenseQuery } from "@tanstack/react-query";
import { Link } from "expo-router";
import { View } from "react-native";
import { SwipeListView } from "react-native-swipe-list-view";

import Item from "@/components/Item";
import ItemDelete from "@/components/ItemDelete";
import useDeleteMeal from "@/mutations/useDeleteMeal";
import mealData from "@/queries/mealData";

export default function Tab() {
  const deleteMeal = useDeleteMeal();
  const { data } = useSuspenseQuery({
    ...mealData(),
  });

  const handleDelete = (uuid: string) => {
    deleteMeal.mutate(uuid);
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
          return (
            <Item
              href={`/(tabs)/automations/meal/${item.uuid}`}
              title={item.title}
              subtitle={`${item.meal_product.length} ingrediënten`}
              iconId={item.icon_id}
              rightBottom={`420 kcal`}
              subtitleIcon="bowl-food"
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
