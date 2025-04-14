import { useMutation, useQueryClient } from "@tanstack/react-query";

import { handleError } from "@/helper";
import supabase from "@/utils/supabase";

export default function useDeleteMeal() {
  const client = useQueryClient();

  return useMutation({
    mutationFn: async (uuid: string): Promise<void> => {
      const { error } = await supabase.from("meal").delete().eq("uuid", uuid);

      handleError(error);
    },
    onMutate: async (uuid: string) => {
      // Cancel any outgoing refetches
      await client.cancelQueries({ queryKey: ["mealData"] });
      const previous = client.getQueryData(["mealData"]);

      // Optimistically update to the new value
      client.setQueryData(["mealData"], (previous: any[] = []) =>
        previous.filter((meal) => meal.uuid !== uuid)
      );

      return { previous };
    },
    onError: (err, newMeal, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      client.setQueryData(["mealData"], context?.previous);

      console.log("[Mutation] failed to delete meal");
    },
    onSettled: () => {
      // Always refetch after error or success
      client.invalidateQueries({ queryKey: ["mealData"] });

      console.log("[Mutation] deleted meal");
    },
  });
}
