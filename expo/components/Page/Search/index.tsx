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
  onProductSelect: (product: string) => void;
};

export default function PageSearch({
  onMealSelect,
  onProductSelect,
}: PageSearchProps) {
  const focus = useIsFocused();

  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(Type.PRODUCTS);

  const { control, watch } = useForm<SearchData>({
    resolver: zodResolver(searchSchema),
  });

  const queryWatched = watch("query");

  useEffect(() => {
    if (focus) {
      return;
    }

    setQuery("");
  }, [focus]);

  const handleSubmit = () => {
    console.log(queryWatched);
    setQuery(queryWatched);
  };

  const placeholder =
    selected === Type.PRODUCTS
      ? "Zoek naar een product..."
      : selected === Type.BASICS
        ? "Zoek naar een basisitem..."
        : "Zoek naar een maaltijd...";

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
          placeholder={placeholder}
          onSubmit={handleSubmit}
        />
      </View>

      {/* TODO: We'll just unmount the component to be sure no random requests get send */}
      {focus && selected === Type.PRODUCTS && (
        <PageSearchProduct query={query} onSelect={onProductSelect} />
      )}

      {selected === Type.MEALS && (
        <PageSearchMeal query={query} onSelect={onMealSelect} />
      )}
    </View>
  );
}
