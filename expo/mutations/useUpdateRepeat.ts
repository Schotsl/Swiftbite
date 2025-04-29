import { handleError } from "@/helper";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Repeat, RepeatWithProductOrMeal } from "@/types";

import supabase from "@/utils/supabase";

export default function useUpdateRepeat() {
  const query = useQueryClient();

  return useMutation({
    mutationFn: async (repeat: RepeatWithProductOrMeal): Promise<Repeat> => {
      const { product, meal, ...rest } = repeat;

      const { data, error } = await supabase
        .from("repeat")
        .update(rest)
        .eq("uuid", repeat.uuid)
        .select()
        .single();

      handleError(error);

      return data;
    },
    onMutate: async (repeatUpdate) => {
      await query.cancelQueries({ queryKey: ["repeatData"] });

      const previous = query.getQueryData<RepeatWithProductOrMeal[]>([
        "repeatData",
      ]);

      const updated = previous?.map((repeat) =>
        repeat.uuid === repeatUpdate.uuid ? repeatUpdate : repeat
      );

      query.setQueryData<RepeatWithProductOrMeal[]>(["repeatData"], updated);

      return { previous };
    },
    // If the mutation fails, roll back
    onError: (error, variables, context) => {
      query.setQueryData(["repeatData"], context?.previous);

      console.log(`[Mutation] failed to update repeat`);
    },
    onSettled: () => {
      query.invalidateQueries({ queryKey: ["repeatData"] });

      console.log(`[Mutation] updated repeat`);
    },
  });
}
