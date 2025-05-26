import PageMeal from "@/components/Page/Meal";
import PageMealLoading from "@/components/Page/Meal/Loading";

import { ServingData } from "@/schemas/serving";

import { useQuery } from "@tanstack/react-query";
import { useMeal } from "@/hooks/useMeal";
import { useEditRepeat } from "@/context/RepeatContext";
import { useLocalSearchParams, Redirect, router } from "expo-router";

import userData from "@/queries/userData";

export default function AutomationsRepeatUpsertMeal() {
  const {
    meal: mealEditing,
    serving,
    remove,
    updateMeal,
    updateServing,
  } = useEditRepeat();

  const { meal: mealId } = useLocalSearchParams<{
    meal: string;
  }>();

  const { data: user, isLoading: isLoadingUser } = useQuery(userData());
  const { meal: mealSearch, isLoading: isLoadingMeal } = useMeal({ mealId });

  if (isLoadingMeal || isLoadingUser) {
    return <PageMealLoading editing={!!serving} />;
  }

  const meal = mealEditing || mealSearch;

  if (!meal || !user) {
    return <Redirect href="/(tabs)/automations/repeat/upsert" />;
  }

  const handleSave = async (returnedServing: ServingData) => {
    updateMeal(meal);
    updateServing(returnedServing);

    router.replace("/(tabs)/automations/repeat/upsert");
  };

  const handleDelete = async () => {
    remove();

    router.replace("/");
  };

  return (
    <PageMeal
      user={user}
      meal={meal}
      serving={serving}
      onSave={handleSave}
      onDelete={handleDelete}
    />
  );
}
