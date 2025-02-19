import { FlatList } from "react-native";
import { View } from "react-native";

import Item from "@/components/Item";
import { useFoodProvider } from "@/context/FoodContext";

export default function Index() {
  const { foods } = useFoodProvider();

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
        data={foods}
        renderItem={({ item }) => <Item {...item} />}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}
