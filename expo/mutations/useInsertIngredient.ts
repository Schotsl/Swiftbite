import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as Crypto from "expo-crypto";

import { handleError } from "@/helper";

import { Ingredient, IngredientInsert } from "@/types";
import supabase from "@/utils/supabase";

export default function useInsertIngredient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ingredient: IngredientInsert): Promise<Ingredient> => {
      const { data, error } = await supabase
        .from("ingredient")
        .insert(ingredient)
        .select()
        .single();

      handleError(error);

      return data;
    },
    onMutate: async (ingredientInsert: IngredientInsert) => {
      // Cancel any outgoing refetches so they don't overwrite our optimistic update
      await queryClient.cancelQueries({ queryKey: ["ingredientData"] });

      const ingredient = {
        ...ingredientInsert,
        uuid: Crypto.randomUUID(),
        updated_at: null,
        created_at: new Date().toISOString(),
      } as Ingredient;

      queryClient.setQueryData<Ingredient[]>(["ingredientData"], (old = []) => [
        ingredient,
        ...old,
      ]);

      const previous = queryClient.getQueryData(["ingredientData"]);
      return { previous };
    },
    // If the mutation fails, roll back
    onError: (error, variables, context) => {
      queryClient.setQueryData(["ingredientData"], context?.previous);

      console.log(`[Mutation] failed to insert ingredient`);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["ingredientData"] });

      console.log(`[Mutation] inserted ingredient`);
    },
  });
}
