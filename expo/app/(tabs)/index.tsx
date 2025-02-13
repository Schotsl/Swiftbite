import { FlatList } from "react-native";
import { View } from "react-native";

import Item from "@/components/Item";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <FlatList
        style={{ width: "100%" }}
        data={[
          { id: "a", title: "Pizza", kcal: 430 },
          { id: "b", title: "Cake", kcal: 300 },
        ]}
        renderItem={({ item }) => <Item {...item} />}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}
