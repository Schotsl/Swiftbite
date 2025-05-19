import { FlatList } from "react-native";
import { ServingData } from "@/schemas/serving";
import { useSuspenseQuery } from "@tanstack/react-query";

import Item from "@/components/Item";
import mealData from "@/queries/mealData";
import ProductStatus from "@/components/Product/Status";

type PageSearchProps = {
  query: string;

  onSelect: (meal: string, serving: ServingData) => void;
};

export default function PageSearchMeal({
  query,

  onSelect,
}: PageSearchProps) {
  const queryLower = query.toLowerCase();

  const { data, isError, isLoading } = useSuspenseQuery({
    ...mealData({}),
    select: (data) =>
      data?.filter((meal) => {
        const titleLower = meal.title.toLowerCase();
        const titleMatch = titleLower.includes(queryLower);

        return titleMatch;
      }),
  });

  const isEmpty = data?.length === 0;

  if (isLoading) {
    return (
      <ProductStatus status="🕵️ We zijn het hele internet aan het zoeken naar jou maaltijden" />
    );
  }

  if (isError) {
    return (
      <ProductStatus
        active={false}
        status="😔 Er is iets mis gegaan tijdens het zoeken naar jou maaltijden"
      />
    );
  }

  if (isEmpty && !query) {
    return (
      <ProductStatus
        active={false}
        status={"😲 Je hebt nog geen maaltijden aan je account toegevoegd"}
      />
    );
  }

  if (isEmpty) {
    return (
      <ProductStatus
        active={false}
        status={"😔 We hebben geen maaltijden gevonden met deze naam"}
      />
    );
  }

  return (
    <FlatList
      data={data}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item }) => {
        return (
          <Item
            title={item.title}
            subtitle={`${item.meal_products?.length || 0} ingrediënten`}
            rightBottom={`420 kcal`}
            subtitleIcon="bowl-food"
            onPress={() =>
              onSelect(item.uuid, {
                gram: item.quantity_gram,
                quantity: 1,
                option: "meal",
              })
            }
          />
        );
      }}
    />
  );
}
