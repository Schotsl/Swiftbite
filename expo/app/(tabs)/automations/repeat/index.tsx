import Tabs from "@/components/Tabs";
import Empty from "@/components/Empty";
import ItemRepeat from "@/components/Item/Repeat";
import ItemActions from "@/components/Item/Actions";
import ItemSkeleton from "@/components/Item/Skeleton";

import repeatData from "@/queries/repeatData";
import useDeleteRepeat from "@/mutations/useDeleteRepeat";

import { Suspense } from "react";
import { rowTimeout } from "@/helper";
import { Alert, View } from "react-native";
import { SwipeListView } from "react-native-swipe-list-view";
import { useSuspenseQuery } from "@tanstack/react-query";
import { usePathname, useRouter } from "expo-router";

import language from "@/language";

export default function AutomationsRepeat() {
  const path = usePathname();
  const router = useRouter();

  const handleSelect = (repeat: string) => {
    router.push({
      pathname: `/(tabs)/automations/repeat/upsert`,
      params: { repeat },
    });
  };

  return (
    <View
      style={{
        minHeight: "100%",
      }}
    >
      <Tabs
        add="/automations/repeat/upsert"
        value={path}
        tabs={[
          { href: "/automations/meal", title: language.types.meal.plural },
          { href: "/automations/repeat", title: language.types.repeat.plural },
        ]}
      />

      <Suspense fallback={<AutomationsRepeatLoading />}>
        <AutomationsRepeatList onSelect={handleSelect} />
      </Suspense>
    </View>
  );
}

type AutomationsRepeatListProps = {
  onSelect: (uuid: string) => void;
};

function AutomationsRepeatList({ onSelect }: AutomationsRepeatListProps) {
  const { data } = useSuspenseQuery({
    ...repeatData({}),
  });

  const deleteRepeat = useDeleteRepeat();

  const handleDelete = (uuid: string) => {
    deleteRepeat.mutate(uuid);
  };

  const handleDuplicate = () => {
    // TODO: language
    Alert.alert(
      "Dupliceer",
      "Deze functionaliteit is helaas nog niet beschikbaar.",
    );
  };

  return (
    <SwipeListView
      data={data}
      keyExtractor={(item) => item.uuid}
      renderItem={({ item }) => <ItemRepeat item={item} onSelect={onSelect} />}
      renderHiddenItem={({ item }) => (
        <ItemActions
          onDelete={() => handleDelete(item.uuid)}
          onDuplicate={() => handleDuplicate()}
        />
      )}
      ListEmptyComponent={<AutomationsRepeatListEmpty />}
      onRowDidOpen={rowTimeout}
      scrollEnabled={false}
      rightOpenValue={-150}
      closeOnRowOpen={true}
      disableRightSwipe={true}
    />
  );
}

function AutomationsRepeatListEmpty() {
  return (
    <Empty
      list={true}
      emoji="🔁"
      content={language.empty.getAdded(language.types.repeat.plural)}
    />
  );
}

function AutomationsRepeatLoading() {
  return (
    <View>
      <ItemSkeleton />
      <ItemSkeleton />
      <ItemSkeleton />
      <ItemSkeleton />
    </View>
  );
}
