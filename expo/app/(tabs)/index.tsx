import { useSuspenseQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { FlatList } from "react-native";
import { View } from "react-native";

import Item from "@/components/Item";
import ingredientData from "@/queries/ingredientData";

export default function Index() {
  const [interval, setInterval] = useState<number | false>(1000);

  const { data } = useSuspenseQuery({
    ...ingredientData(),
    refetchInterval: interval,
  });

  // If any of the titles or calories are missing we'll keep polling
  useEffect(() => {
    const processing = data.some((item) => !item.title || !item.calorie_100g);
    const interval = processing ? 500 : false;

    setInterval(interval);
  }, [data]);

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
        data={data}
        renderItem={({ item }) => <Item {...item} />}
        keyExtractor={(item) => item.uuid}
      />
    </View>
  );
}
