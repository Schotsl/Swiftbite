import { MealWithProduct } from "@/types";
import { FlatList } from "react-native";
import { useSuspenseQuery } from "@tanstack/react-query";

import Item from "@/components/Item";
import mealData from "@/queries/mealData";
import ProductStatus from "@/components/Product/Status";

type PageSearchProps = {
  query: string;
  loading?: boolean;

  onSelect: (meal: MealWithProduct) => void;
};

export default function PageSearchMeal({
  query,
  loading: loadingOverwrite,

  onSelect,
}: PageSearchProps) {
  const queryLower = query.toLowerCase();

  const { data, isError, isLoading } = useSuspenseQuery({
    ...mealData(),
    select: (data) =>
      data?.filter((meal) => {
        const titleLower = meal.title.toLowerCase();
        const titleMatch = titleLower.includes(queryLower);

        return titleMatch;
      }),
  });

  const isEmpty = data?.length === 0;

  if (isLoading || loadingOverwrite) {
    return (
      <ProductStatus status="🕵️ We zijn het hele internet aan het zoeken naar jou product" />
    );
  }

  if (isError) {
    return (
      <ProductStatus
        active={false}
        status="😔 Er is iets mis gegaan tijdens het zoeken naar jou product"
      />
    );
  }

  if (isEmpty) {
    return (
      <ProductStatus
        active={false}
        status={"😔 We hebben geen producten gevonden met deze naam"}
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
            onPress={() => onSelect(item)}
          />
        );
      }}
    />
  );
}
