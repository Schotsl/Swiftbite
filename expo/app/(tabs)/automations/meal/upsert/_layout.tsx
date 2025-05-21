import mealData from "@/queries/mealData";

import { View } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { MealProvider } from "@/context/MealContext";
import { Slot, useLocalSearchParams } from "expo-router";

import Header from "@/components/Header";
import ProductStatus from "@/components/Product/Status";

export default function AutomationsMealUpsertLayout() {
  const { meal: mealId } = useLocalSearchParams<{ meal: string }>();

  const { data, isLoading } = useQuery({
    ...mealData({ uuid: mealId }),
    select: (data) => data[0],
    enabled: !!mealId,
  });

  if (isLoading) {
    return <AutomationsMealUpsertLayoutLoading />;
  }

  return (
    <MealProvider initial={data!}>
      <Slot />
    </MealProvider>
  );
}

function AutomationsMealUpsertLayoutLoading() {
  return (
    <View style={{ flex: 1, padding: 32 }}>
      <Header
        title="Bewerk maaltijd"
        content="Een maaltijd is een combinatie van producten die je opslaat om later in één keer toe te voegen."
      />

      <ProductStatus status="We zijn je maaltijd aan het laden uit onze database" />
    </View>
  );
}
