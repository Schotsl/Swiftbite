import { useMutation, useQueryClient } from "@tanstack/react-query";

import { handleError } from "@/helper";
import { Meal, MealWithProduct } from "@/types";
import supabase from "@/utils/supabase";

export default function useUpdateMeal() {
  const query = useQueryClient();

  return useMutation({
    mutationFn: async (meal: Meal): Promise<Meal> => {
      const { title } = meal;

      const { data, error } = await supabase
        .from("meal")
        .update({ title })
        .eq("uuid", meal.uuid)
        .select()
        .single();

      handleError(error);

      return data;
    },
    onMutate: async (mealUpdate) => {
      await query.cancelQueries({ queryKey: ["mealData"] });

      const previous = query.getQueryData<MealWithProduct[]>(["mealData"]);
      const updated = previous?.map((meal) =>
        meal.uuid === mealUpdate.uuid ? { ...meal, ...mealUpdate } : meal,
      );

      query.setQueryData<MealWithProduct[]>(["mealData"], updated);

      return { previous };
    },
    // If the mutation fails, roll back
    onError: (error, variables, context) => {
      query.setQueryData(["mealData"], context?.previous);

      console.log(`[Mutation] failed to update meal`);
    },
    onSettled: () => {
      query.invalidateQueries({ queryKey: ["mealData"] });

      console.log(`[Mutation] updated meal`);
    },
  });
}
