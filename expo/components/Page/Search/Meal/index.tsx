// HAPPY

import { Meal } from "@/types/meal";
import { FlatList } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { ServingData } from "@/schemas/serving";

import language from "@/language";
import mealData from "@/queries/mealData";

import ItemMeal from "@/components/Item/Meal";
import ProductStatus from "@/components/Product/Status";

type PageSearchProps = {
  query: string;

  onSelect: (meal: string, serving: ServingData) => void;
};

export default function PageSearchMeal({
  query,

  onSelect,
}: PageSearchProps) {
  const label = language.types.meal.plural;
  const lower = query.toLowerCase();

  const filter = (meal: Meal) => {
    const titleLower = meal.title.toLowerCase();
    const titleMatch = titleLower.includes(lower);

    return titleMatch;
  };

  const { data, isError, isLoading } = useQuery({
    ...mealData({}),
    select: (data) => data?.filter(filter),
  });

  const isEmpty = data?.length === 0;

  if (isLoading) {
    return <ProductStatus status={language.search.results.getLoading(label)} />;
  }

  if (isError) {
    return (
      <ProductStatus
        active={false}
        status={language.search.results.getError(label)}
      />
    );
  }

  if (isEmpty && !query) {
    return <ProductStatus active={false} status={language.empty.meal} />;
  }

  if (isEmpty) {
    return (
      <ProductStatus
        active={false}
        status={language.search.results.getEmpty(label)}
      />
    );
  }

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.uuid}
      renderItem={({ item }) => {
        const handleSelect = (uuid: string) => {
          onSelect(uuid, {
            gram: item.quantity_gram,
            option: "meal",
            quantity: 1,
          });
        };

        return <ItemMeal meal={item} onSelect={handleSelect} />;
      }}
    />
  );
}
