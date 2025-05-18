import supabase from "@/utils/supabase";

import * as Crypto from "expo-crypto";

import { handleError } from "@/helper";
import { Entry, EntryInsert } from "@/types/entry";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function useInsertEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (entry: EntryInsert): Promise<Entry> => {
      const { data, error } = await supabase
        .from("entry")
        .insert(entry)
        .select()
        .single();

      handleError(error);

      return data;
    },
    onMutate: async (entryInsert: EntryInsert) => {
      // Cancel any outgoing refetches so they don't overwrite our optimistic update
      await queryClient.cancelQueries({ queryKey: ["entryData"] });

      // Create a fake entry with estimated values for immediate display
      const entry = {
        ...entryInsert,
        uuid: Crypto.randomUUID(),
        updated_at: null,
        created_at: new Date().toISOString(),
        product: {
          uuid: entryInsert.product_id,
          title: null,
          icon_id: null,
          calorie_100g: null,
        },
      };

      // Add the fake entry to the cache
      queryClient.setQueryData<any[]>(["entryData"], (old = []) => [
        entry,
        ...old,
      ]);

      const previous = queryClient.getQueryData(["entryData"]);
      return { previous };
    },
    // If the mutation fails, roll back
    onError: (error, variables, context) => {
      queryClient.setQueryData(["entryData"], context?.previous);

      console.log(`[Mutation] failed to insert entry`);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["entryData"] });

      console.log(`[Mutation] inserted entry`);
    },
  });
}
