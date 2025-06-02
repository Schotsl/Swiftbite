import supabase from "@/utils/supabase";

import { Repeat, RepeatInsert } from "@/types/repeat";
import { handleError } from "@/helper";
import { useQueryClient, useMutation } from "@tanstack/react-query";

export default function useInsertRepeat() {
  const queryClient = useQueryClient();

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
    onSuccess: (repeat) => {
      queryClient.invalidateQueries({ queryKey: ["repeatData"] });
      queryClient.invalidateQueries({ queryKey: ["repeatData", repeat.uuid] });
    },
  });
}
