import { useMutation, useQueryClient } from "@tanstack/react-query";

import { handleError } from "@/helper";
import { MealProductWithProduct, MealWithProduct } from "@/types";
import supabase from "@/utils/supabase";

export default function useUpdateMealProduct() {
  const query = useQueryClient();

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
      await query.cancelQueries({ queryKey: ["mealData"] });
      const previous = query.getQueryData<MealWithProduct[]>(["mealData"]);

      const updated = previous?.map((meal) => {
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
