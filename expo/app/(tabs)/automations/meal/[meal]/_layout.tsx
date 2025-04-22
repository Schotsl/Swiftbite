import { MealProvider } from "@/context/MealContext";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ActivityIndicator } from "react-native";
import { Slot, useLocalSearchParams } from "expo-router";

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
    <MealProvider initial={data!}>
      <Slot />
    </MealProvider>
  );
}
