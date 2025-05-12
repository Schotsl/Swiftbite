import { queryOptions } from "@tanstack/react-query";
import { handleError, mapMeal } from "@/helper";

import supabase from "@/utils/supabase";

export default function mealData() {
  return queryOptions({
    queryKey: ["mealData"],
    queryFn: async () => {
      const { error, data } = await supabase
        .from("meal")
        .select(`*,meal_product (*,product (*))`)
        .order("title", { ascending: false });

      handleError(error);

      console.log(`[Query] fetched ${data?.length} meal_product`);

      const mapped = data?.map(mapMeal);
      return mapped;
    },
  });
}
