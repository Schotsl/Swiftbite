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

  // I've kept the navigation here so it's on a higher component level
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
        <AutomationsMealList onSelect={handleSelect} />
      </Suspense>
    </View>
  );
}

type AutomationsMealListProps = {
  onSelect: (uuid: string) => void;
};

function AutomationsMealList({ onSelect }: AutomationsMealListProps) {
  const { data } = useSuspenseQuery(mealData({}));

  const deleteMeal = useDeleteMeal();

  const handleDelete = (uuid: string) => {
    deleteMeal.mutate(uuid);
  };

  const handleDuplicate = () => {
    // TODO: language
    Alert.alert(
      "Dupliceer",
      "Deze functionaliteit is helaas nog niet beschikbaar."
    );
  };

  // I would use the empty prop in the list but then the button isn't clickable
  if (data.length === 0) {
    return <AutomationsMealListEmpty />;
  }

  return (
    <SwipeListView
      data={data}
      keyExtractor={(item) => item.uuid}
      renderItem={({ item }) => (
        <ItemMeal icon={false} meal={item} onSelect={onSelect} />
      )}
      renderHiddenItem={({ item }) => (
        <ItemActions
          onDelete={() => handleDelete(item.uuid)}
          onDuplicate={handleDuplicate}
        />
      )}
      onRowDidOpen={rowTimeout}
      scrollEnabled={false}
      rightOpenValue={-150}
      closeOnRowOpen={true}
      disableRightSwipe={true}
    />
  );
}

function AutomationsMealListEmpty() {
  const router = useRouter();

  return (
    <Empty
      emoji="🌮"
      content={language.empty.getAdded(language.types.meal.plural)}
      button={{
        icon: "plus",
        title: language.modifications.getInsert(language.types.meal.single),
        onPress: () => {
          router.push({
            pathname: `/(tabs)/automations/meal/upsert`,
          });
        },
      }}
    />
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
