import { queryOptions } from "@tanstack/react-query";

import { handleError } from "@/helper";
import { EntryWithProduct } from "@/types";
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
        .select(
          `*,product:product_id (*),meal:meal_id (*,meal_product (*,product (*))))`,
        )
        .order("created_at", { ascending: false });

      handleError(error);

      // For some reason the Supabase parser give a error type but it works fine otherwise
      const dataUnknown = data as unknown;
      const dataParsed = dataUnknown as EntryWithProduct[];

      return dataParsed;
    },
  });
}
