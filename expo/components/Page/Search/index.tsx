import { useIsFocused } from "@react-navigation/native";
import { Meal, ProductSearch } from "@/types";
import { SafeAreaView, View } from "react-native";
import { useEffect, useRef, useState } from "react";

import Tabs from "@/components/Tabs";
import Input from "@/components/Input";
import PageSearchProduct from "./Product";
import PageSearchMeal from "./Meal";

enum Type {
  MEALS = "meals",
  BASICS = "basics",
  PRODUCTS = "products",
}

type PageSearchProps = {
  onMealSelect: (meal: Meal) => void;
  onProductSelect: (product: ProductSearch) => void;
};

export default function PageSearch({
  onMealSelect,
  onProductSelect,
}: PageSearchProps) {
  const focus = useIsFocused();
  const timeout = useRef<NodeJS.Timeout | null>(null);

  const [query, setQuery] = useState("");
  const [queryTimed, setQueryTimed] = useState("");

  const [selected, setSelected] = useState(Type.PRODUCTS);

  const handleInput = (text: string) => {
    setQuery(text);

    timeout.current = setTimeout(() => setQueryTimed(text), 1000);
  };

  useEffect(() => {
    if (focus) {
      return;
    }

    setQuery("");
    setQueryTimed("");

    if (timeout.current) {
      clearTimeout(timeout.current);
    }
  }, [focus]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Tabs
        onSelect={(value) => setSelected(value as Type)}
        value={selected}
        tabs={[
          { value: Type.PRODUCTS, title: "Producten" },
          { value: Type.BASICS, title: "Basisitems" },
          { value: Type.MEALS, title: "Maaltijden" },
        ]}
      />
      <View
        style={{
          padding: 16,
          paddingHorizontal: 32,
          borderBottomWidth: 2,
          borderBottomColor: "#000000",
        }}
      >
        <Input
          name="query"
          type="default"
          icon="magnifying-glass"
          value={query}
          placeholder="Search for food..."
          onChange={handleInput}
        />
      </View>

      {selected === Type.PRODUCTS && (
        <PageSearchProduct
          query={queryTimed}
          loading={queryTimed !== query}
          onSelect={onProductSelect}
        />
      )}

      {selected === Type.MEALS && (
        <PageSearchMeal query={query} onSelect={onMealSelect} />
      )}
    </SafeAreaView>
  );
}
