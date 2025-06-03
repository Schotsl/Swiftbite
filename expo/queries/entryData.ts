import { Entry } from "@/types/entry";
import { queryOptions } from "@tanstack/react-query";
import {
  getDateKey,
  getDateRange,
  handleError,
  mapMeal,
} from "@/helper";

import supabase from "@/utils/supabase";

type EntryDataProps =
  | {
      uuid?: never;
      date: Date;
    }
  | {
      uuid: string;
      date?: never;
    };

export default function entryData({ date, uuid }: EntryDataProps) {
  return queryOptions({
    queryKey: date ? ["entryData", getDateKey(date)] : ["entryData", uuid],
    queryFn: async (): Promise<Entry[]> => {
      const query = supabase
        .from("entry")
        .select(
          `*,product:product_id (*),meal:meal_id (*,meal_products:meal_product (*,product (*))))`,
        )
        .order("created_at", { ascending: false });

      if (date) {
        const { start, end } = getDateRange(date);

        query
          .gte("created_at", start.toISOString())
          .lte("created_at", end.toISOString());
      }

      if (uuid) {
        query.eq("uuid", uuid);
      }

      const { data, error } = await query;

      handleError(error);

      // We'll have to map the meal to get the total_grams
      const dataMapped = data?.map((entry: any) => {
        return {
          ...entry,
          meal: entry.meal ? mapMeal(entry.meal) : null,
          created_at: new Date(entry.created_at),
          updated_at: entry.updated_at ? new Date(entry.updated_at) : null,
        };
      });

      return dataMapped || [];
    },
    refetchInterval: 60000,
  });
}
