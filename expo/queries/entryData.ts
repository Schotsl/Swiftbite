import { Entry } from "@/types";
import { queryOptions } from "@tanstack/react-query";
import { handleError, mapMeal } from "@/helper";

import supabase from "@/utils/supabase";

export default function entryData<T extends Entry>() {
  return queryOptions({
    queryKey: ["entryData"],
    queryFn: async () => {
      const { error, data } = await supabase
        .from("entry")
        .select(
          `*,product:product_id (*),meal:meal_id (*,meal_products:meal_product (*,product (*))))`
        )
        .order("created_at", { ascending: false });

      handleError(error);

      // We'll have to map the meal to get the total_grams
      const dataMapped = data?.map((entry: any) => {
        if (entry.meal) {
          return {
            ...entry,
            meal: mapMeal(entry.meal),
          };
        }

        return entry;
      });

      const dataParsed = dataMapped as T[];
      return dataParsed;
    },
  });
}
