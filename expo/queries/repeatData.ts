import supabase from "@/utils/supabase";

import { Repeat } from "@/types/repeat";
import { handleError, mapMeal } from "@/helper";
import { queryOptions } from "@tanstack/react-query";

type RepeatDataProps = {
  uuid?: string;
};

export default function repeatData({ uuid }: RepeatDataProps) {
  return queryOptions({
    queryKey: uuid ? ["repeatData", uuid] : ["repeatData"],
    queryFn: async (): Promise<Repeat[]> => {
      const query = supabase
        .from("repeat")
        .select(
          `*, product(*), meal(*, meal_products:meal_product(*, product:product(*)))`,
        )
        .order("created_at", { ascending: false });

      if (uuid) {
        query.eq("uuid", uuid);
      }

      const { error, data } = await query;

      handleError(error);
      const mapped = data?.map((repeat) => ({
        ...repeat,
        time: new Date(repeat.time),
        meal: repeat.meal ? mapMeal(repeat.meal) : null,
      }));

      console.log(`[Query] fetched ${data?.length} repeats`);

      return mapped as Repeat[];
    },
  });
}
