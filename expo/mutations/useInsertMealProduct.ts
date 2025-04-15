import { useMutation, useQueryClient } from "@tanstack/react-query";

import { handleError } from "@/helper";
import {
  MealProduct,
  MealProductInsert,
  MealProductWithProduct,
  MealWithProduct,
} from "@/types";
import supabase from "@/utils/supabase";

export default function useInsertMealProduct() {
  const query = useQueryClient();

  return useMutation({
    mutationFn: async (
      mealProduct: MealProductInsert,
    ): Promise<MealProduct | null> => {
      const { data, error } = await supabase
        .from("meal_product")
        .insert(mealProduct)
        .select()
        .single();

      handleError(error);

      return data;
    },
    onMutate: async (mealProductInsert: MealProductInsert) => {
      await query.cancelQueries({ queryKey: ["mealData"] });
      const previous = query.getQueryData<MealWithProduct[]>(["mealData"]);

      const updated = previous?.map((meal) => {
        if (meal.uuid !== mealProductInsert.meal_id) {
          return meal;
        }

        // Construct a partial optimistic update for the UI
        const optimisticProduct: Partial<MealProductWithProduct> = {
          ...mealProductInsert,
          // We are missing the full 'product' details here.
          // The full MealContext state handles the richer optimistic update.
          // This mutation's optimistic update is simpler.
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          user_id: "temp-user-id", // Placeholder
          product: {} as any, // Placeholder for missing product data
        };

        // Create a new array with the optimistic product added
        const updatedMealProduct = [
          ...meal.meal_product,
          optimisticProduct as MealProductWithProduct,
        ];

        return { ...meal, meal_product: updatedMealProduct };
      });

      query.setQueryData(["mealData"], updated);

      return { previous };
    },
    onError: (err, variables, context) => {
      query.setQueryData(["mealData"], context?.previous);

      console.error("[Mutation] failed to insert meal_product", err);
    },
    onSettled: (data, error, variables) => {
      query.invalidateQueries({ queryKey: ["mealData"] });

      console.log(`[Mutation] inserted meal_product`);
    },
  });
}
