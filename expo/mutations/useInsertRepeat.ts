import * as crypto from "expo-crypto";

import supabase from "@/utils/supabase";

import { Repeat, RepeatInsert } from "@/types/repeat";
import { handleError } from "@/helper";
import { useMutation } from "@tanstack/react-query";

export default function useInsertRepeat() {
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
  });
}
