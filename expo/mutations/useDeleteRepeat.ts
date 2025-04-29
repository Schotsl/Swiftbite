import { useMutation, useQueryClient } from "@tanstack/react-query";

import { handleError } from "@/helper";
import supabase from "@/utils/supabase";

export default function useDeleteRepeat() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (uuid: string): Promise<void> => {
      const { error } = await supabase.from("repeat").delete().eq("uuid", uuid);

      handleError(error);
    },
    onMutate: async (uuid: string) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["repeatData"] });
      const previousEntries = queryClient.getQueryData(["repeatData"]);

      // Optimistically update to the new value
      queryClient.setQueryData(["repeatData"], (old: any[] = []) =>
        old.filter((repeat) => repeat.uuid !== uuid),
      );

      return { previousEntries };
    },
    onError: (err, newRepeat, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      queryClient.setQueryData(["repeatData"], context?.previousEntries);

      console.log("[Mutation] failed to delete repeat");
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ["repeatData"] });

      console.log("[Mutation] deleted repeat");
    },
  });
}
