import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getDateKey, handleError } from "@/helper";
import { Entry } from "@/types/entry";

import supabase from "@/utils/supabase";

export default function useDeleteEntry() {
  const client = useQueryClient();

  return useMutation({
    mutationFn: async (entry: Entry): Promise<void> => {
      console.log(`[Mutation] deleting entry ${entry.uuid}`);

      const { error } = await supabase
        .from("entry")
        .delete()
        .eq("uuid", entry.uuid);

      handleError(error);
    },
    onMutate: async (entry: Entry) => {
      console.log("[Mutation] mutating entries");

      const uuid = entry.uuid;
      const date = getDateKey(entry.created_at);

      await client.cancelQueries({ queryKey: ["entryData", uuid] });
      await client.cancelQueries({ queryKey: ["entryData", date] });

      const previousUuid =
        client.getQueryData<Entry[]>(["entryData", uuid]) || [];

      const previousDate =
        client.getQueryData<Entry[]>(["entryData", date]) || [];

      const filteredUuid = previousUuid.filter((entry) => entry.uuid !== uuid);
      const filteredDate = previousDate.filter((entry) => entry.uuid !== uuid);

      client.setQueryData(["entryData", uuid], filteredUuid);
      client.setQueryData(["entryData", date], filteredDate);

      return { uuid, date, previousUuid, previousDate };
    },
    onError: (err, entry, context) => {
      console.log("[Mutation] failed to delete entry");

      // If the mutation fails, use the context returned from onMutate to roll back
      client.setQueryData(["entryData", context?.uuid], context?.previousUuid);
      client.setQueryData(["entryData", context?.date], context?.previousDate);
    },
    onSettled: (data, error, uuid, context) => {
      console.log("[Mutation] deleted entry");

      // Always refetch after error or success
      client.invalidateQueries({ queryKey: ["entryData", context?.uuid] });
      client.invalidateQueries({ queryKey: ["entryData", context?.date] });
    },
  });
}
