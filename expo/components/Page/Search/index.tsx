import { useIsFocused } from "@react-navigation/native";
import { Meal, ProductSearch } from "@/types";
import { SafeAreaView, View } from "react-native";
import { useEffect, useRef, useState } from "react";

import Tabs from "@/components/Tabs";
import Input from "@/components/Input";
import PageSearchProduct from "./Product";
import PageSearchMeal from "./Meal";

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

  const [selected, setSelected] = useState("products");

  const [query, setQuery] = useState("");
  const [queryTimed, setQueryTimed] = useState("");

  const handleInput = (text: string) => {
    setQuery(text);

    if (selected === "meals") {
      setQueryTimed(text);

      return;
    }

    timeout.current = setTimeout(() => setQueryTimed(text), 500);
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
        onSelect={(value) => setSelected(value)}
        value={selected}
        tabs={[
          { value: "products", title: "Producten" },
          { value: "basics", title: "Basisitems" },
          { value: "meals", title: "Maaltijden" },
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

      {selected === "products" && (
        <PageSearchProduct query={queryTimed} onSelect={onProductSelect} />
      )}

      {selected === "meals" && (
        <PageSearchMeal query={queryTimed} onSelect={onMealSelect} />
      )}
    </SafeAreaView>
  );
}
