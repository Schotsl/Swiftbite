import Tabs from "@/components/Tabs";
import Empty from "@/components/Empty";
import ItemDelete from "@/components/Item/Delete";
import ItemRepeat from "@/components/Item/Repeat";
import ItemSkeleton from "@/components/Item/Skeleton";

import repeatData from "@/queries/repeatData";
import useDeleteRepeat from "@/mutations/useDeleteRepeat";

import { View } from "react-native";
import { Suspense } from "react";
import { rowTimeout } from "@/helper";
import { SwipeListView } from "react-native-swipe-list-view";
import { useSuspenseQuery } from "@tanstack/react-query";
import { usePathname, useRouter } from "expo-router";

import language from "@/language";

export default function AutomationsRepeat() {
  const path = usePathname();
  const router = useRouter();

  const { data } = useSuspenseQuery(repeatData({}));

  const deleteRepeat = useDeleteRepeat();

  const handleDelete = (uuid: string) => {
    deleteRepeat.mutate(uuid);
  };

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
        <SwipeListView
          data={data}
          keyExtractor={(item) => item.uuid}
          ListEmptyComponent={<AutomationsRepeatEmpty />}
          renderItem={({ item }) => (
            <ItemRepeat item={item} onSelect={handleSelect} />
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

function AutomationsRepeatEmpty() {
  return (
    <Empty
      emoji="🔁"
      content={language.empty.getAdded(language.types.repeat.plural)}
    />
  );
}
