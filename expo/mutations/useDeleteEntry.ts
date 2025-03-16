import { useMutation, useQueryClient } from "@tanstack/react-query";

import { handleError } from "@/helper";
import supabase from "@/utils/supabase";

export default function useDeleteEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (uuid: string): Promise<void> => {
      const { error } = await supabase.from("entry").delete().eq("uuid", uuid);

      handleError(error);
    },
    onMutate: async (uuid: string) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["entryData"] });
      const previousEntries = queryClient.getQueryData(["entryData"]);

      // Optimistically update to the new value
      queryClient.setQueryData(["entryData"], (old: any[] = []) =>
        old.filter((entry) => entry.uuid !== uuid),
      );

      return { previousEntries };
    },
    onError: (err, newEntry, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      queryClient.setQueryData(["entryData"], context?.previousEntries);

      console.log("[Mutation] failed to delete entry");
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ["entryData"] });

      console.log("[Mutation] deleted entry");
    },
  });
}
