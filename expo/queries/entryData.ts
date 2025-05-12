import { queryOptions } from "@tanstack/react-query";

import { Entry } from "@/types";
import { handleError } from "@/helper";

import supabase from "@/utils/supabase";

type entryDataType = {
  openfood?: string;
};

export default function entryData<T extends Entry>({
  openfood,
}: entryDataType) {
  return queryOptions({
    queryKey: ["entryData", openfood],
    queryFn: async () => {
      const { error, data } = await supabase
        .from("entry")
        .select(
          `*,product:product_id (*),meal:meal_id (*,meal_product (*,product (*))))`
        )
        .order("created_at", { ascending: false });

      handleError(error);

      // For some reason the Supabase parser give a error type but it works fine otherwise
      const dataUnknown = data as unknown;
      const dataParsed = dataUnknown as T[];

      return dataParsed;
    },
  });
}
