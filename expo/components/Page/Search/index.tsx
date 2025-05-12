import { View } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { MealWithProduct, ProductSearch } from "@/types";
import { useEffect, useRef, useState } from "react";

import Tabs from "@/components/Tabs";
import Input from "@/components/Input";
import PageSearchProduct from "./Product";
import PageSearchMeal from "./Meal";

import { useForm } from "react-hook-form";
import { SearchData, searchSchema } from "@/schemas/search";
import { zodResolver } from "@hookform/resolvers/zod";

enum Type {
  MEALS = "meals",
  BASICS = "basics",
  PRODUCTS = "products",
}

type PageSearchProps = {
  onMealSelect: (meal: MealWithProduct) => void;
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

  const { control, watch } = useForm<SearchData>({
    resolver: zodResolver(searchSchema),
  });

  const queryWatched = watch("query");

  useEffect(() => {
    if (!queryWatched) {
      return;
    }

    if (queryWatched === query) {
      return;
    }

    setQuery(queryWatched);
  }, [query, queryWatched]);

  // TODO: This is very janky but if I move it inside the other useEffect the timeout won't trigger
  useEffect(() => {
    if (timeout.current) {
      clearTimeout(timeout.current);
    }

    timeout.current = setTimeout(() => setQueryTimed(query), 1000);

    return () => {
      if (!timeout.current) {
        return;
      }

      clearTimeout(timeout.current);
    };
  }, [query]);

  useEffect(() => {
    if (focus) {
      return;
    }

    setQuery("");
    setQueryTimed("");

    if (!timeout.current) {
      return;
    }

    clearTimeout(timeout.current);
  }, [focus]);

  return (
    <View style={{ flex: 1 }}>
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
          flexDirection: "row",
          paddingHorizontal: 32,
          borderBottomWidth: 2,
          borderBottomColor: "#000000",
        }}
      >
        <Input
          name="query"
          icon="magnifying-glass"
          control={control}
          placeholder="Zoek naar een product..."
        />
      </View>

      {/* TODO: We'll just unmount the component to be sure no random requests get send */}
      {focus && selected === Type.PRODUCTS && (
        <PageSearchProduct
          query={queryTimed}
          loading={queryTimed !== query}
          onSelect={onProductSelect}
        />
      )}
      {selected === Type.MEALS && (
        <PageSearchMeal query={query} onSelect={onMealSelect} />
      )}
    </View>
  );
}
