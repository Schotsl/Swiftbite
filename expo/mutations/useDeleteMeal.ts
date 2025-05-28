import supabase from "@/utils/supabase";

import { handleError } from "@/helper";
import { MealWithProduct } from "@/types/meal";
import { useQueryClient, useMutation } from "@tanstack/react-query";

export default function useDeleteMeal() {
  const client = useQueryClient();

  return useMutation({
    mutationFn: async (uuid: string): Promise<void> => {
      const { error } = await supabase.from("meal").delete().eq("uuid", uuid);

      handleError(error);
    },
    onMutate: async (uuid: string) => {
      await client.cancelQueries({ queryKey: ["mealData"] });
      await client.cancelQueries({ queryKey: ["mealData", uuid] });

      // Filter out the list and specific meal from the cache
      const previous =
        client.getQueryData<MealWithProduct[]>(["mealData"]) || [];

      const previousSpecific = client.getQueryData(["mealData", uuid]);
      const previousFiltered = previous.filter((meal) => meal.uuid !== uuid);

      client.setQueryData(["mealData"], previousFiltered);

      if (previousSpecific) client.setQueryData(["mealData", uuid], []);

      return { previous, previousSpecific, uuid };
    },
    onError: (err, variables, context) => {
      // Restore the entire list
      if (context?.previous)
        client.setQueryData(["mealData"], context.previous);

      // Restore the specific meal
      if (context?.previousSpecific) {
        client.setQueryData(
          ["mealData", context.uuid],
          context.previousSpecific
        );
      }
    },
    onSettled: (data, error, uuid, context) => {
      // Always refetch after error or success for both query types
      client.invalidateQueries({ queryKey: ["mealData"] });
      client.invalidateQueries({ queryKey: ["mealData", uuid] });
    },
  });
}
