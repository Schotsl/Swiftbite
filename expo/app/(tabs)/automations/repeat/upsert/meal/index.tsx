import PageMeal from "@/components/Page/Meal";
import PageMealLoading from "@/components/Page/Meal/Loading";

import { ServingData } from "@/schemas/serving";

import { useMeal } from "@/hooks/useMeal";
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

  const { meal: mealSearch, isLoading } = useMeal({ mealId });

  if (isLoading) {
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
