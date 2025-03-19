import { queryOptions } from "@tanstack/react-query";

import { handleError } from "@/helper";
import supabase from "@/utils/supabase";

import { Ingredient } from "../types";

export default function ingredientData(openfood?: string) {
  return queryOptions({
    queryKey: ["ingredientData", openfood],
    queryFn: async () => {
      let query = supabase
        .from("ingredient")
        .select(`*`)
        .order("created_at", { ascending: false });

      if (openfood) {
        query = query.eq("openfood_id", openfood);
      }

      const { error, data } = await query;

      handleError(error);

      console.log(`[Query] fetched ${data?.length} ingredients`);

      return data as Ingredient[];
    },
  });
}
