import { View } from "react-native";
import { useState } from "react";
import { ServingData } from "@/schemas/serving";

import Tabs from "@/components/Tabs";
import PageSearchMeal from "./Meal";
import PageSearchProduct from "./Product";

import language from "@/language";

export enum SearchType {
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
  const [selected, setSelected] = useState<SearchType>(SearchType.PRODUCTS);

  const handleTab = (type: SearchType) => {
    setSelected(type);
  };

  const type =
    selected === SearchType.PRODUCTS ? "search_product" : "search_generic";

  return (
    <View style={{ flex: 1 }}>
      <Tabs
        back={true}
        add={"/add/product-add"}
        onSelect={(value) => handleTab(value as SearchType)}
        value={selected}
        tabs={
          meal
            ? [
                {
                  value: SearchType.PRODUCTS,
                  title: language.types.product.plural,
                },
                {
                  value: SearchType.BASICS,
                  title: language.types.basic.plural,
                },
                { value: SearchType.MEALS, title: language.types.meal.plural },
              ]
            : [
                {
                  value: SearchType.PRODUCTS,
                  title: language.types.product.plural,
                },
                {
                  value: SearchType.BASICS,
                  title: language.types.basic.plural,
                },
              ]
        }
      />

      {(selected === SearchType.PRODUCTS || selected === SearchType.BASICS) && (
        <PageSearchProduct type={type} onSelect={onProductSelect} />
      )}

      {selected === SearchType.MEALS && onMealSelect && (
        <PageSearchMeal onSelect={onMealSelect} />
      )}
    </View>
  );
}
