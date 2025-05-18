import supabase from "@/utils/supabase";

import { Repeat } from "@/types/repeat";
import { handleError } from "@/helper";
import { queryOptions } from "@tanstack/react-query";

export default function repeatData() {
  return queryOptions({
    queryKey: ["repeatData"],
    queryFn: async () => {
      let query = supabase
        .from("repeat")
        .select(`*, product(*), meal(*)`)
        .order("created_at", { ascending: false });

      const { error, data } = await query;

      handleError(error);

      const mapped = data?.map((repeat) => ({
        ...repeat,
        time: new Date(repeat.time),
      }));

      console.log(`[Query] fetched ${data?.length} repeats`);

      return mapped as Repeat[];
    },
  });
}
