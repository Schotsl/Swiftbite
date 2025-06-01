import supabase from "@/utils/supabase";

import { Repeat } from "@/types/repeat";
import { handleError } from "@/helper";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function useDeleteRepeat() {
  const client = useQueryClient();

  return useMutation({
    mutationFn: async (uuid: string): Promise<void> => {
      const { error } = await supabase.from("repeat").delete().eq("uuid", uuid);

      handleError(error);
    },
    onMutate: async (uuid: string) => {
      await client.cancelQueries({ queryKey: ["repeatData"] });
      await client.cancelQueries({ queryKey: ["repeatData", uuid] });

      // Filter out the list and specific repeat from the cache
      const previous = client.getQueryData<Repeat[]>(["repeatData"]) || [];

      const previousSpecific = client.getQueryData(["repeatData", uuid]);
      const previousFiltered = previous.filter(
        (repeat) => repeat.uuid !== uuid
      );

      client.setQueryData(["repeatData"], previousFiltered);

      if (previousSpecific) client.setQueryData(["repeatData", uuid], []);

      return { previous, previousSpecific, uuid };
    },
    onError: (err, variables, context) => {
      // Restore the entire list
      if (context?.previous)
        client.setQueryData(["repeatData"], context.previous);

      // Restore the specific repeat
      if (context?.previousSpecific) {
        client.setQueryData(
          ["repeatData", context.uuid],
          context.previousSpecific
        );
      }
    },
    onSettled: (data, error, uuid, context) => {
      // Always refetch after error or success for both query types
      client.invalidateQueries({ queryKey: ["repeatData"] });
      client.invalidateQueries({ queryKey: ["repeatData", uuid] });
    },
  });
}
