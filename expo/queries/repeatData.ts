import supabase from "@/utils/supabase";

import { Repeat } from "@/types/repeat";
import { handleError } from "@/helper";
import { queryOptions } from "@tanstack/react-query";

type RepeatDataProps = {
  uuid?: string;
};

export default function repeatData({ uuid }: RepeatDataProps) {
  return queryOptions({
    queryKey: ["repeatData", uuid],
    queryFn: async (): Promise<Repeat[]> => {
      const select = uuid
        ? `*, product(*), meal(*)`
        : `*, product(title), meal(title)`;

      const query = supabase
        .from("repeat")
        .select(select)
        .order("created_at", { ascending: false });

      if (uuid) {
        query.eq("uuid", uuid);
      }

      const { error, data } = await query;

      handleError(error);

      // Very weird but if we paste "*, product:product(*), meal:meal(*)" into the select it's fine but the ternary causes a non-blocking syntax error
      const repeats = data as unknown as Repeat[];
      const mapped = repeats.map((repeat) => ({
        ...repeat,
        time: new Date(repeat.time),
      }));

      console.log(`[Query] fetched ${data?.length} repeats`);

      return mapped;
    },
  });
}
