import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Ingredient } from "../types";
import supabase from "../utils/supabase";

export default function useDeleteIngredient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (uuid: string): Promise<void> => {
      const { error } = await supabase
        .from("ingredient")
        .delete()
        .eq("uuid", uuid);

      if (error) throw error;
    },
    onMutate: async (uuid: string) => {
      // Cancel any outgoing refetches so they don't overwrite our optimistic update
      await queryClient.cancelQueries({ queryKey: ["ingredientData"] });

      // Get the current ingredients data
      const previousIngredients = queryClient.getQueryData<Ingredient[]>([
        "ingredientData",
      ]);

      // Optimistically update the UI by removing the deleted ingredient
      queryClient.setQueryData<Ingredient[]>(["ingredientData"], (old = []) =>
        old.filter((ingredient) => ingredient.uuid !== uuid),
      );

      // Return context with the previous ingredients for potential rollback
      return { previousIngredients };
    },
    // If the mutation fails, roll back to the previous state
    onError: (error, uuid, context) => {
      queryClient.setQueryData(
        ["ingredientData"],
        context?.previousIngredients,
      );
      console.log(`[Mutation] failed to delete ingredient`, error);
    },
    // Always refetch after error or success
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["ingredientData"] });
      console.log(`[Mutation] deleted ingredient`);
    },
  });
}
