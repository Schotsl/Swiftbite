import Tabs from "@/components/Tabs";
import repeatData from "@/queries/repeatData";
import ItemDelete from "@/components/Item/Delete";
import ItemRepeatWithProductOrMeal from "@/components/Item/RepeatWithProductOrMeal";

import { View } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { SwipeListView } from "react-native-swipe-list-view";
import { usePathname, useRouter } from "expo-router";

export default function Tab() {
  const path = usePathname();
  const router = useRouter();

  const { data } = useQuery(repeatData());

  const handleDelete = (uuid: string) => {
    // TODO: Implement delete
  };

  return (
    <View
      style={{
        height: "100%",
      }}
    >
      <Tabs
        add="/automations/repeat/upsert"
        value={path}
        tabs={[
          { href: "/automations/meal", title: "Maaltijden" },
          { href: "/automations/repeat", title: "Herhalen" },
        ]}
      />

      <SwipeListView
        data={data}
        keyExtractor={(item) => item.uuid}
        renderItem={({ item }) => (
          <ItemRepeatWithProductOrMeal
            item={item}
            onPress={() => {
              router.push({
                pathname: `/(tabs)/automations/repeat/upsert`,
                params: {
                  repeat: item.uuid,
                },
              });
            }}
          />
        )}
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
