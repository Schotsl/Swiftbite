import { useMutation, useQueryClient } from "@tanstack/react-query";

import { handleError } from "@/helper";
import { MealProductWithProduct, MealWithProduct } from "@/types";
import supabase from "@/utils/supabase";

export default function useUpdateMealProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      mealProduct: MealProductWithProduct,
    ): Promise<MealProductWithProduct> => {
      const { product, ...rest } = mealProduct;

      const { data, error } = await supabase
        .from("meal_product")
        .update(rest)
        .eq("product_id", mealProduct.product_id)
        .eq("meal_id", mealProduct.meal_id)
        .select()
        .single();

      handleError(error);

      return data;
    },
    onMutate: async (mealProductInsert: MealProductWithProduct) => {
      // Cancel any outgoing refetches so they don't overwrite our optimistic update
      await queryClient.cancelQueries({ queryKey: ["mealData"] });

      // Add the fake entry to the cache
      queryClient.setQueryData<MealWithProduct[]>(
        ["mealData"],
        (previous = []) =>
          previous?.map((meal) => {
            // Ensure we have the right meal ID
            if (meal.uuid !== mealProductInsert.meal_id) {
              return meal;
            }

            // Replace the old product with the new one
            meal.meal_product = meal.meal_product.map((product) => {
              if (product.product_id !== mealProductInsert.product_id) {
                return product;
              }

              return mealProductInsert;
            });

            return meal;
          }),
      );

      const previous = queryClient.getQueryData(["mealData"]);
      return { previous };
    },
    // If the mutation fails, roll back
    onError: (error, variables, context) => {
      queryClient.setQueryData(["mealData"], context?.previous);

      console.log(`[Mutation] failed to insert entry`);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["mealData"] });

      console.log(`[Mutation] inserted entry`);
    },
  });
}
