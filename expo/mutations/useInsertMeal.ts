import supabase from "@/utils/supabase";

import { handleError } from "@/helper";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { Meal, MealInsert } from "@/types/meal";

export default function useInsertMeal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (mealInsert: MealInsert): Promise<Meal> => {
      const { title } = mealInsert;
      const { data, error } = await supabase
        .from("meal")
        .insert({ title })
        .select()
        .single();

      handleError(error);

      return data;
    },
    onSuccess: (meal) => {
      queryClient.invalidateQueries({ queryKey: ["mealData"] });
      queryClient.invalidateQueries({ queryKey: ["mealData", meal.uuid] });
    },
  });
}
