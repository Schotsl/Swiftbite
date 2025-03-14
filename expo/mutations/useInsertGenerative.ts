import { useMutation } from "@tanstack/react-query";

import { handleError } from "@/helper";

import { Generative, GenerativeInsert } from "../types";
import supabase from "../utils/supabase";

export default function useInsertGenerative() {
  return useMutation({
    mutationFn: async (generative: GenerativeInsert): Promise<Generative> => {
      const { error, data } = await supabase
        .from("generative")
        .insert(generative)
        .select()
        .single();

      handleError(error);

      return data;
    },
    onSettled: (data, error, variables) => {
      console.log(`[Mutation] inserted generative`);
    },
  });
}
