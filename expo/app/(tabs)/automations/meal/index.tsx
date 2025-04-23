import { View } from "react-native";
import { SwipeListView } from "react-native-swipe-list-view";
import { useSuspenseQuery } from "@tanstack/react-query";
import { usePathname, useRouter } from "expo-router";

import Tabs from "@/components/Tabs";
import ItemMeal from "@/components/Item/Meal";
import ItemDelete from "@/components/Item/Delete";

import mealData from "@/queries/mealData";
import useDeleteMeal from "@/mutations/useDeleteMeal";

export default function Tab() {
  const path = usePathname();
  const router = useRouter();
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
            <ItemMeal
              meal={item}
              onPress={() => {
                router.push(`/(tabs)/automations/meal/${item.uuid}`);
              }}
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
