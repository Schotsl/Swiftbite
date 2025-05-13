import { queryOptions } from "@tanstack/react-query";

import { handleError } from "@/helper";
import { Product } from "@/types";
import supabase from "@/utils/supabase";

type productDataType = {
  uuid?: string;
  barcode?: string;
};

export default function productData({ uuid, barcode }: productDataType) {
  return queryOptions({
    queryKey: ["productData", uuid, barcode],
    queryFn: async () => {
      let query = supabase
        .from("product")
        .select(`*`)
        .order("created_at", { ascending: false });

      if (barcode) {
        query = query.eq("barcode", barcode);
      }

      if (uuid) {
        query = query.eq("uuid", uuid);
      }

      const { error, data } = await query;

      handleError(error);

      console.log(`[Query] fetched ${data?.length} products`);

      return data as Product[];
    },
  });
}
