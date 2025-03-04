import { queryOptions } from "@tanstack/react-query";

import { handleError } from "@/helper";
import supabase from "@/utils/supabase";

import { Ingredient } from "../types";

export default function ingredientData() {
  return queryOptions({
    queryKey: ["ingredientData"],
    queryFn: async () => {
      const { error, data } = await supabase
        .from("ingredient")
        .select(`*`)
        .order("created_at", { ascending: false });

      handleError(error);

      console.log(`[Query] fetched ${data?.length} ingredients`);

      return data as Ingredient[];
    },
  });
}
