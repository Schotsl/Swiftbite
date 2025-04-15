import { useMutation, useQueryClient } from "@tanstack/react-query";

import { handleError } from "@/helper";
import { MealProductWithProduct } from "@/types";
import supabase from "@/utils/supabase";

export default function useDeleteMealProduct() {
  const client = useQueryClient();

  return useMutation({
    mutationFn: async ({
      mealId,
      productId,
    }: {
      mealId: string;
      productId: string;
    }): Promise<void> => {
      const { error } = await supabase
        .from("meal_product")
        .delete()
        .eq("meal_id", mealId)
        .eq("product_id", productId);

      handleError(error);
    },
    onMutate: async ({ mealId, productId }) => {
      // Cancel any outgoing refetches
      await client.cancelQueries({ queryKey: ["mealData"] });
      const previous = client.getQueryData(["mealData"]);

      // Optimistically update to the new value
      client.setQueryData(["mealData"], (previous: any[] = []) =>
        previous.map((meal) => {
          if (meal.uuid !== mealId) {
            return meal;
          }

          // Filter out the product from the meal
          meal.meal_product.filter(
            (product: MealProductWithProduct) =>
              product.product_id !== productId,
          );

          return meal;
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
