import { handleError } from "@/helper";
import { Entry, EntryWithProduct } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import supabase from "@/utils/supabase";

export default function useUpdateEntry() {
  const query = useQueryClient();

  return useMutation({
    mutationFn: async (entry: Entry): Promise<Entry> => {
      const { consumed_quantity, consumed_option } = entry;

      const { data, error } = await supabase
        .from("entry")
        .update({ consumed_quantity, consumed_option })
        .eq("uuid", entry.uuid)
        .select()
        .single();

      handleError(error);

      return data;
    },
    onMutate: async (entryUpdate) => {
      await query.cancelQueries({ queryKey: ["entryData"] });

      const previous = query.getQueryData<EntryWithProduct[]>(["entryData"]);
      const updated = previous?.map((entry) =>
        entry.uuid === entryUpdate.uuid ? { ...entry, ...entryUpdate } : entry,
      );

      query.setQueryData<EntryWithProduct[]>(["entryData"], updated);

      return { previous };
    },
    // If the mutation fails, roll back
    onError: (error, variables, context) => {
      query.setQueryData(["entryData"], context?.previous);

      console.log(`[Mutation] failed to update entry`);
    },
    onSettled: () => {
      query.invalidateQueries({ queryKey: ["entryData"] });

      console.log(`[Mutation] updated entry`);
    },
  });
}
