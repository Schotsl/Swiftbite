import { queryOptions } from "@tanstack/react-query";

import { handleError } from "@/helper";
import { MealWithProduct } from "@/types";
import supabase from "@/utils/supabase";

type mealDataType = {};

export default function mealData({}: mealDataType) {
  return queryOptions({
    queryKey: ["mealData"],
    queryFn: async () => {
      const { error, data } = await supabase
        .from("meal")
        .select(`*,meal_product (*,product (*))`)
        .order("title", { ascending: false });

      handleError(error);

      console.log(`[Query] fetched ${data?.length} entries`);

      return data as MealWithProduct[];
    },
  });
}
