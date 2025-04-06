import { queryOptions } from "@tanstack/react-query";

import { handleError } from "@/helper";
import { EntryWithIngredient } from "@/types";
import supabase from "@/utils/supabase";

type entryDataType = {
  openfood?: string;
};

export default function entryData({ openfood }: entryDataType) {
  return queryOptions({
    queryKey: ["entryData", openfood],
    queryFn: async () => {
      const { error, data } = await supabase
        .from("entry")
        .select(`*,ingredient:ingredient_id (*)`)
        .order("created_at", { ascending: false });

      handleError(error);

      console.log(`[Query] fetched ${data?.length} entries`);

      return data as EntryWithIngredient[];
    },
  });
}
