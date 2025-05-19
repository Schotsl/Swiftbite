import { View } from "react-native";
import { useForm } from "react-hook-form";
import { ServingData } from "@/schemas/serving";
import { zodResolver } from "@hookform/resolvers/zod";
import { useIsFocused } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { SearchData, searchSchema } from "@/schemas/search";

import Tabs from "@/components/Tabs";
import Input from "@/components/Input";
import PageSearchMeal from "./Meal";
import PageSearchProduct from "./Product";

enum Type {
  MEALS = "meals",
  BASICS = "basics",
  PRODUCTS = "products",
}

type PageSearchProps =
  | {
      meal?: true;
      onMealSelect: (meal: string, serving: ServingData) => void;
      onProductSelect: (product: string) => void;
    }
  | {
      meal: false;
      onMealSelect?: never;
      onProductSelect: (product: string) => void;
    };

export default function PageSearch({
  meal = true,
  onMealSelect,
  onProductSelect,
}: PageSearchProps) {
  const focus = useIsFocused();

  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(Type.PRODUCTS);

  const { control, watch, reset } = useForm<SearchData>({
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
    setQuery(queryWatched);
  };

  const handleTab = (type: Type) => {
    reset({ query: "" });

    setQuery("");
    setSelected(type);
  };

  const placeholder =
    selected === Type.PRODUCTS
      ? "Zoek naar een product..."
      : selected === Type.BASICS
        ? "Zoek naar een basisitem..."
        : "Zoek naar een maaltijd...";

  const type = selected === Type.PRODUCTS ? "search_product" : "search_generic";
  const product = selected === Type.PRODUCTS || selected === Type.BASICS;

  return (
    <View style={{ flex: 1 }}>
      <Tabs
        back={true}
        onSelect={(value) => handleTab(value as Type)}
        value={selected}
        tabs={
          meal
            ? [
                { value: Type.PRODUCTS, title: "Producten" },
                { value: Type.BASICS, title: "Basisitems" },
                { value: Type.MEALS, title: "Maaltijden" },
              ]
            : [
                { value: Type.PRODUCTS, title: "Producten" },
                { value: Type.BASICS, title: "Basisitems" },
              ]
        }
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
      {focus && product && (
        <PageSearchProduct
          type={type}
          query={query}
          queryWatched={queryWatched}
          onSelect={onProductSelect}
        />
      )}

      {selected === Type.MEALS && onMealSelect && (
        <PageSearchMeal query={query} onSelect={onMealSelect} />
      )}
    </View>
  );
}
