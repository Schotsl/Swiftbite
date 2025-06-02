import supabase from "@/utils/supabase";

import * as Crypto from "expo-crypto";

import { Entry } from "@/types/entry";
import { handleError } from "@/helper";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function useDuplicateEntry() {
  const client = useQueryClient();

  return useMutation({
    mutationFn: async (entry: Entry): Promise<Entry> => {
      const { user_id, meal_id, product_id, serving } = entry;

      const insert = {
        uuid: Crypto.randomUUID(),
        user_id,
        meal_id,
        product_id,
        serving,
        created_at: new Date(),
      };

      const { data, error } = await supabase
        .from("entry")
        .insert(insert)
        .select()
        .single();

      handleError(error);

      return data;
    },
    onMutate: async (entry: Entry) => {
      const date = getDate(entry.created_at);
      const insert = {
        ...entry,
        uuid: Crypto.randomUUID(),
        created_at: new Date(),
      };

      await client.cancelQueries({ queryKey: ["entryData", date] });

      const previous = client.getQueryData<Entry[]>(["entryData", date]) || [];
      const previousUpdated = [insert, ...previous];

      client.setQueryData(["entryData", date], previousUpdated);

      return { date, previous };
    },
    onError: (err, entry, context) => {
      // If the mutation fails use the context returned from onMutate to roll back
      client.setQueryData(["entryData", context?.date], context?.previous);

      console.log("[Mutation] failed to duplicate entry");
    },
    onSettled: (data, error, entry, context) => {
      // Always refetch after error or success
      client.invalidateQueries({ queryKey: ["entryData", context?.date] });

      console.log("[Mutation] duplicated entry");
    },
  });
}

function getDate(date?: Date) {
  if (!date) {
    return undefined;
  }

  return date.toISOString().split("T")[0];
}
