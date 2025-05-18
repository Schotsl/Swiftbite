import supabase from "@/utils/supabase";

import { handleError } from "@/helper";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MealProductBase, MealWithProduct } from "@/types/meal";

export default function useUpdateMealProduct() {
  const query = useQueryClient();

  return useMutation({
    mutationFn: async (
      mealProduct: MealProductBase
    ): Promise<MealProductBase> => {
      const { product, ...rest } = mealProduct;

      const { data, error } = await supabase
        .from("meal_product")
        .update(rest)
        .eq("product_id", mealProduct.product.uuid)
        .eq("meal_id", mealProduct.meal_id)
        .select()
        .single();

      handleError(error);

      return data;
    },
    onMutate: async (mealProductInsert: MealProductBase) => {
      // Cancel any outgoing refetches so they don't overwrite our optimistic update
      await query.cancelQueries({ queryKey: ["mealData"] });
      const previous = query.getQueryData<MealWithProduct[]>(["mealData"]);

      const updated = previous?.map((meal) => {
        // Ensure we have the right meal ID
        if (meal.uuid !== mealProductInsert.meal_id) {
          return meal;
        }

        // Replace the old product with the new one
        meal.meal_products =
          meal.meal_products?.map((product) => {
            if (product.product.uuid !== mealProductInsert.product.uuid) {
              return product;
            }

            return mealProductInsert;
          }) || [];

        return meal;
      });

      query.setQueryData(["mealData"], updated);

      return { previous };
    },
    // If the mutation fails, roll back
    onError: (error, variables, context) => {
      query.setQueryData(["mealData"], context?.previous);

      console.log(`[Mutation] failed to update meal_product`);
    },
    onSettled: () => {
      query.invalidateQueries({ queryKey: ["mealData"] });

      console.log(`[Mutation] updated meal_product`);
    },
  });
}
