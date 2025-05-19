import mealData from "@/queries/mealData";
import PageMeal from "@/components/Page/Meal";
import HeaderLoading from "@/components/Header/Loading";
import ProductStatus from "@/components/Product/Status";

import { View } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { ServingData } from "@/schemas/serving";
import { useEditRepeat } from "@/context/RepeatContext";
import { useLocalSearchParams, Redirect, router } from "expo-router";

export default function AutomationRepeatUpsertMeal() {
  const {
    meal: mealEditing,
    serving,
    updateMeal,
    removeMeal,
    updateServing,
  } = useEditRepeat();

  const { meal: mealId } = useLocalSearchParams<{
    meal: string;
  }>();

  const { data: mealSearch, isLoading: isLoadingSearch } = useQuery({
    ...mealData({ uuid: mealId }),
    select: (meals) => meals[0],
    enabled: !!mealId,
  });

  if (isLoadingSearch) {
    return (
      <View style={{ padding: 32, minHeight: "100%" }}>
        <HeaderLoading />

        <ProductStatus status="We zijn de maaltijd in onze database aan het zoeken" />
      </View>
    );
  }

  const meal = mealEditing || mealSearch;

  if (!meal) {
    return <Redirect href="/(tabs)/automations/repeat/upsert" />;
  }

  const handleSave = async (returnedServing: ServingData) => {
    updateMeal(meal);
    updateServing(returnedServing);

    router.replace("/(tabs)/automations/repeat/upsert");
  };

  const handleDelete = async () => {
    removeMeal();

    router.replace("/");
  };

  return (
    <PageMeal
      meal={meal}
      serving={serving}
      onSave={handleSave}
      onDelete={handleDelete}
    />
  );
}
