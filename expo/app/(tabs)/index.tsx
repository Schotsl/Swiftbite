import { FlatList } from "react-native";
import { View } from "react-native";

import Item from "@/components/Item";
import { useFoodProvider } from "@/context/FoodContext";
import { useEffect, useState } from "react";
import { FoodItem } from "@/types";
import { supabase } from "@/supabase";

export default function Index() {
  const { foods } = useFoodProvider();
  const [database, setDatabase] = useState<FoodItem[]>([]);

  useEffect(() => {
    const loadFood = async () => {
      const { data } = await supabase.from("food").select("id,title,nutrition");
      setDatabase(data as FoodItem[]);
    };

    loadFood();
  }, []);

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
        data={[...foods, ...database]}
        renderItem={({ item }) => <Item {...item} />}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}
