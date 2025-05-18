import * as crypto from "expo-crypto";

import supabase from "@/utils/supabase";

import { handleError } from "@/helper";
import { Meal, MealInsert } from "@/types/meal";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function useInsertMeal() {
  const query = useQueryClient();

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
    // Optimistically add the new meal to the list
    onMutate: async (mealInsert) => {
      await query.cancelQueries({ queryKey: ["mealData"] });

      const meal = {
        ...mealInsert,
        uuid: crypto.randomUUID(),
        updated_at: null,
        created_at: new Date().toISOString(),
      } as Meal;

      query.setQueryData<Meal[]>(["mealData"], (old = []) => [meal, ...old]);

      const previous = query.getQueryData<Meal[]>(["mealData"]);
      return { previous };
    },
    onError: (err, mealInsert, context) => {
      query.setQueryData(["mealData"], context?.previous);

      console.error("[Mutation] failed to insert meal");
    },
    onSettled: (data, error, variables) => {
      query.invalidateQueries({ queryKey: ["mealData"] });

      console.log(`[Mutation] inserted meal`);
    },
  });
}
