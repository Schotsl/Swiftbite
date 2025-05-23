import { View } from "react-native";
import { Suspense } from "react";
import { rowTimeout } from "@/helper";
import { SwipeListView } from "react-native-swipe-list-view";
import { useSuspenseQuery } from "@tanstack/react-query";
import { usePathname, useRouter } from "expo-router";

import Tabs from "@/components/Tabs";
import Empty from "@/components/Empty";
import ItemMeal from "@/components/Item/Meal";
import ItemDelete from "@/components/Item/Delete";
import ItemSkeleton from "@/components/Item/Skeleton";

import mealData from "@/queries/mealData";
import useDeleteMeal from "@/mutations/useDeleteMeal";
import language from "@/language";

export default function AutomationsMeal() {
  const path = usePathname();
  const router = useRouter();

  const deleteMeal = useDeleteMeal();

  const { data } = useSuspenseQuery({
    ...mealData({}),
  });

  const handleDelete = (uuid: string) => {
    deleteMeal.mutate(uuid);
  };

  const handleSelect = (meal: string) => {
    router.push({
      pathname: `/(tabs)/automations/meal/upsert`,
      params: { meal },
    });
  };

  return (
    <View
      style={{
        minHeight: "100%",
      }}
    >
      <Tabs
        add="/automations/meal/upsert"
        value={path}
        tabs={[
          { href: "/automations/meal", title: language.types.meal.plural },
          { href: "/automations/repeat", title: language.types.repeat.plural },
        ]}
      />

      <Suspense fallback={<AutomationsMealLoading />}>
        <SwipeListView
          data={data}
          keyExtractor={(item) => item.uuid}
          ListEmptyComponent={<AutomationsMealEmpty />}
          renderItem={({ item }) => (
            <ItemMeal icon={false} meal={item} onSelect={handleSelect} />
          )}
          renderHiddenItem={({ item }) => (
            <ItemDelete onDelete={() => handleDelete(item.uuid)} />
          )}
          onRowDidOpen={rowTimeout}
          rightOpenValue={-75}
          useNativeDriver={true}
          disableRightSwipe={true}
        />
      </Suspense>
    </View>
  );
}

function AutomationsMealLoading() {
  return (
    <View>
      <ItemSkeleton icon={false} />
      <ItemSkeleton icon={false} />
      <ItemSkeleton icon={false} />
      <ItemSkeleton icon={false} />
    </View>
  );
}

function AutomationsMealEmpty() {
  return (
    <Empty
      emoji="🌮"
      content={language.empty.getAdded(language.types.meal.plural)}
    />
  );
}
