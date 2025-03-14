import { queryOptions } from "@tanstack/react-query";

import { EntryWithIngredient } from "@/types";

import { handleError } from "../helper";
import supabase from "../utils/supabase";

export default function entryData() {
  return queryOptions({
    queryKey: ["entryData"],
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
