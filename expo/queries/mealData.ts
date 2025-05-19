import { queryOptions } from "@tanstack/react-query";
import { MealWithProduct } from "@/types/meal";
import { handleError, mapMeal } from "@/helper";

import supabase from "@/utils/supabase";

type MealDataProps = {
  uuid?: string;
};

export default function mealData({ uuid }: MealDataProps) {
  return queryOptions({
    queryKey: ["mealData", uuid],
    queryFn: async (): Promise<MealWithProduct[]> => {
      const query = supabase
        .from("meal")
        .select(`*,meal_products:meal_product (*)`)
        .order("title", { ascending: false });

      if (uuid) {
        query.eq("uuid", uuid);
      }

      const { error, data } = await query;

      handleError(error);

      console.log(`[Query] fetched ${data?.length} meal_product`);

      const mapped = data?.map(mapMeal);
      return mapped ?? [];
    },
  });
}
