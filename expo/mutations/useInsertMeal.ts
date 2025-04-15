import { useMutation, useQueryClient } from "@tanstack/react-query";

import { handleError } from "@/helper";
import * as crypto from "expo-crypto";

import { Meal, MealInsert } from "@/types";
import supabase from "@/utils/supabase";

export default function useInsertMeal() {
  const query = useQueryClient();

  return useMutation({
    mutationFn: async (mealInsert: MealInsert): Promise<Meal> => {
      const { title, uuid } = mealInsert;
      const { data, error } = await supabase
        .from("meal")
        .insert({ title, uuid })
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
