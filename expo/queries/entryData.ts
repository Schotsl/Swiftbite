import { Entry } from "@/types";
import { queryOptions } from "@tanstack/react-query";
import { handleError, mapMeal } from "@/helper";

import supabase from "@/utils/supabase";

type EntryDataProps = {
  date?: Date;
};

export default function entryData<T extends Entry>({ date }: EntryDataProps) {
  return queryOptions({
    queryKey: ["entryData", getDate(date)],
    queryFn: async (): Promise<T[]> => {
      const query = supabase
        .from("entry")
        .select(
          `*,product:product_id (*),meal:meal_id (*,meal_products:meal_product (*,product (*))))`
        )
        .order("created_at", { ascending: false });

      if (date) {
        query
          .lte("created_at", `${getDate(date)}T23:59:59.999Z`)
          .gte("created_at", `${getDate(date)}T00:00:00.000Z`);
      }

      const { data, error } = await query;

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

function getDate(date?: Date) {
  if (!date) {
    return undefined;
  }

  return date.toISOString().split("T")[0];
}
