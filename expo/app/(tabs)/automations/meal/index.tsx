import { View } from "react-native";
import { usePathname } from "expo-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { SwipeListView } from "react-native-swipe-list-view";

import Tabs from "@/components/Tabs";
import Item from "@/components/Item";
import ItemDelete from "@/components/Item/Delete";

import mealData from "@/queries/mealData";
import useDeleteMeal from "@/mutations/useDeleteMeal";

export default function Tab() {
  const path = usePathname();
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
      }}
    >
      <Tabs
        add="/automations/meal/insert"
        value={path}
        tabs={[
          { href: "/automations/meal", title: "Meal" },
          { href: "/automations/automation", title: "Automations" },
        ]}
      />

      <SwipeListView
        data={data}
        keyExtractor={(item) => item.uuid}
        renderItem={({ item }) => {
          return (
            <Item
              href={`/(tabs)/automations/meal/${item.uuid}`}
              title={item.title}
              subtitle={`${item.meal_product.length} ingrediënten`}
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
