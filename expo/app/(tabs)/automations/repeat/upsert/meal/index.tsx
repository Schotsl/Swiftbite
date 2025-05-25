import mealData from "@/queries/mealData";
import PageMeal from "@/components/Page/Meal";
import PageMealLoading from "@/components/Page/Meal/Loading";

import { useQuery } from "@tanstack/react-query";
import { ServingData } from "@/schemas/serving";
import { useEditRepeat } from "@/context/RepeatContext";
import { useLocalSearchParams, Redirect, router } from "expo-router";

export default function AutomationsRepeatUpsertMeal() {
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
    return <PageMealLoading editing={!!serving} />;
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
