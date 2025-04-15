import { useSuspenseQuery } from "@tanstack/react-query";
import { Slot, useLocalSearchParams } from "expo-router";
import { ActivityIndicator } from "react-native";

import { MealProvider } from "@/context/MealContext";
import mealData from "@/queries/mealData";

export default function MealLayout() {
  const { meal: mealId } = useLocalSearchParams<{ meal: string }>();

  const { data, isLoading } = useSuspenseQuery({
    ...mealData(),
    select: (data) => data.find((meal) => meal.uuid === mealId),
  });

  if (isLoading) {
    return <ActivityIndicator />;
  }

  return (
    <MealProvider initialMeal={data!}>
      <Slot />
    </MealProvider>
  );
}
