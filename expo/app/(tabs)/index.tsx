import { useSuspenseQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";

import CaloriesBurned from "@/components/CaloriesBurned";
import Item from "@/components/Item";
import UserWeight from "@/components/UserWeight";
import ingredientData from "@/queries/ingredientData";

export default function Index() {
  const [interval, setInterval] = useState<number | false>(1000);

  const { data } = useSuspenseQuery({
    ...ingredientData(),
    refetchInterval: interval,
  });

  // If any of the titles or calories are missing we'll keep polling
  useEffect(() => {
    const processing = data.some(
      (item) => !item.title || !item.calorie_100g || !item.icon_id
    );

    const interval = processing ? 500 : false;

    setInterval(interval);
  }, [data]);

  return (
    <View style={styles.container}>
      <View style={styles.statsContainer}>
        <CaloriesBurned />
        <UserWeight />
      </View>

      <FlatList
        style={styles.list}
        data={data}
        renderItem={({ item }) => <Item {...item} />}
        keyExtractor={(item) => item.uuid}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
  },
  statsContainer: {
    paddingTop: 16,
    paddingBottom: 8,
  },
  list: {
    width: "100%",
  },
});
