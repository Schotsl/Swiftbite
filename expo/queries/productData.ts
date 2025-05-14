import { queryOptions } from "@tanstack/react-query";

import { handleError } from "@/helper";
import { Product } from "@/types";
import supabase from "@/utils/supabase";

type productDataType = {
  rpc?: "product_most_recent" | "product_most_used" | "product_favorite";
  uuid?: string;
  uuids?: string[];
  barcode?: string;
};

export default function productData({
  rpc,
  uuid,
  uuids,
  barcode,
}: productDataType) {
  return queryOptions({
    queryKey: ["productData", rpc, uuid, uuids, barcode],
    queryFn: async () => {
      if (rpc) {
        const session = await supabase.auth.getSession();
        const userId = session.data.session?.user.id;

        const { data, error } = await supabase.rpc(rpc, {
          param_user_id: userId,
        });

        handleError(error);

        return data as Product[];
      }

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

      if (uuids) {
        query = query.in("uuid", uuids);
      }

      const { error, data } = await query;

      handleError(error);

      console.log(`[Query] fetched ${data?.length} products`);

      return data as Product[];
    },
  });
}
