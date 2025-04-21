import { queryOptions } from "@tanstack/react-query";

import { handleError } from "@/helper";
import { Product } from "@/types";
import supabase from "@/utils/supabase";

type productDataType = {
  openfood?: string;
};

export default function productData({ openfood }: productDataType) {
  return queryOptions({
    queryKey: ["productData", openfood],
    queryFn: async () => {
      let query = supabase
        .from("product")
        .select(`*`)
        .order("created_at", { ascending: false });

      if (openfood) {
        query = query.eq("barcode", openfood);
      }

      const { error, data } = await query;

      handleError(error);

      console.log(`[Query] fetched ${data?.length} products`);

      return data as Product[];
    },
  });
}
