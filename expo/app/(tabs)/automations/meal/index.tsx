import { Alert, View } from "react-native";
import { Suspense } from "react";
import { rowTimeout } from "@/helper";
import { SwipeListView } from "react-native-swipe-list-view";
import { useSuspenseQuery } from "@tanstack/react-query";
import { usePathname, useRouter } from "expo-router";

import Tabs from "@/components/Tabs";
import Empty from "@/components/Empty";
import ItemMeal from "@/components/Item/Meal";
import ItemActions from "@/components/Item/Actions";
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

  const handleDuplicate = () => {
    // TODO: language
    Alert.alert(
      "Dupliceer",
      "Deze functionaliteit is helaas nog niet beschikbaar.",
    );
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
          renderItem={({ item }) => (
            <ItemMeal icon={false} meal={item} onSelect={handleSelect} />
          )}
          renderHiddenItem={({ item }) => (
            <ItemActions
              onDelete={() => handleDelete(item.uuid)}
              onDuplicate={() => handleDuplicate()}
            />
          )}
          ListEmptyComponent={<AutomationsMealEmpty />}
          onRowDidOpen={rowTimeout}
          scrollEnabled={false}
          rightOpenValue={-150}
          closeOnRowOpen={true}
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
      list={true}
      emoji="🌮"
      content={language.empty.getAdded(language.types.meal.plural)}
    />
  );
}
