import * as crypto from "expo-crypto";

import supabase from "@/utils/supabase";

import { handleError } from "@/helper";
import { Repeat, RepeatInsert } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function useInsertRepeat() {
  const query = useQueryClient();

  return useMutation({
    mutationFn: async (repeatInsert: RepeatInsert): Promise<Repeat> => {
      const { data, error } = await supabase
        .from("repeat")
        .insert(repeatInsert)
        .select()
        .single();

      handleError(error);

      return data;
    },
    // Optimistically add the new repeat to the list
    onMutate: async (repeatInsert) => {
      await query.cancelQueries({ queryKey: ["repeatData"] });

      const repeat = {
        ...repeatInsert,

        uuid: crypto.randomUUID(),
        time: repeatInsert.time.toISOString(),

        updated_at: null,
        created_at: new Date().toISOString(),

        // TODO: We could probably always filter out the user_id
        user_id: "temp-user-id",
      } as Repeat;

      query.setQueryData<Repeat[]>(["repeatData"], (old = []) => [
        repeat,
        ...old,
      ]);

      const previous = query.getQueryData<Repeat[]>(["repeatData"]);
      return { previous };
    },
    onError: (err, repeatInsert, context) => {
      query.setQueryData(["repeatData"], context?.previous);

      console.error("[Mutation] failed to insert repeat");
    },
    onSettled: (data, error, variables) => {
      query.invalidateQueries({ queryKey: ["repeatData"] });

      console.log(`[Mutation] inserted repeat`);
    },
  });
}
