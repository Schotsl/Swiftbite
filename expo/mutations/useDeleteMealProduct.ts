import { handleError } from "@/helper";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import supabase from "@/utils/supabase";

export default function useDeleteMealProduct() {
  const client = useQueryClient();

  return useMutation({
    mutationFn: async (mealId: string): Promise<void> => {
      const { error } = await supabase
        .from("meal_product")
        .delete()
        .eq("meal_id", mealId);

      handleError(error);
    },
    onMutate: async (mealId) => {
      // Cancel any outgoing refetches
      await client.cancelQueries({ queryKey: ["mealData"] });
      const previous = client.getQueryData(["mealData"]);

      // Optimistically update to the new value
      client.setQueryData(["mealData"], (previous: any[] = []) =>
        previous.map((meal) => {
          if (meal.uuid !== mealId) {
            return meal;
          }

          return {
            ...meal,
            meal_product: [],
          };
        }),
      );

      return { previous };
    },
    onError: (err, newMeal, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      client.setQueryData(["mealData"], context?.previous);

      console.log("[Mutation] failed to delete meal_product");
    },
    onSettled: () => {
      // Always refetch after error or success
      client.invalidateQueries({ queryKey: ["mealData"] });

      console.log("[Mutation] deleted meal_product");
    },
  });
}
