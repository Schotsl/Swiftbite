import mealData from "@/queries/mealData";

import { useQuery } from "@tanstack/react-query";
import { MealProvider } from "@/context/MealContext";
import { ActivityIndicator } from "react-native";
import { Slot, useLocalSearchParams } from "expo-router";

export default function AutomationsMealUpsertLayout() {
  const { meal: mealId } = useLocalSearchParams<{ meal: string }>();

  const { data, isLoading } = useQuery({
    ...mealData({ uuid: mealId }),
    select: (data) => data[0],
    enabled: !!mealId,
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
