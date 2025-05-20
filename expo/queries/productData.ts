import { queryOptions } from "@tanstack/react-query";
import { handleError } from "@/helper";
import { Product } from "@/types/product";
import { Enums } from "@/database.types";

import supabase from "@/utils/supabase";

type productDataType =
  | {
      rpc: "product_most_recent" | "product_most_used" | "product_favorite";
      type: Enums<"type">;
      uuid?: never;
      uuids?: never;
      search?: never;
    }
  | {
      uuid: string;
      rpc?: never;
      type?: never;
      uuids?: never;
      search?: never;
    }
  | {
      uuids: string[];
      rpc?: never;
      type?: never;
      uuid?: never;
      search?: never;
    };

export default function productData({
  rpc,
  type,
  uuid,
  uuids,
  search,
}: productDataType) {
  return queryOptions({
    queryKey: ["productData", rpc, uuid, uuids, search],
    queryFn: async (): Promise<Product[]> => {
      // TODO: This should probably be handled by the type
      if (!rpc && !type && !uuid && !uuids && !search) {
        throw new Error("No parameters provided for productData");
      }

      if (rpc) {
        const session = await supabase.auth.getSession();
        const userId = session.data.session?.user.id;

        const { data, error } = await supabase.rpc(rpc, {
          param_user_id: userId,
          param_type: type,
        });

        handleError(error);

        return data;
      }

      let query = supabase
        .from("product")
        .select(`*`)
        .order("created_at", { ascending: false });

      if (search) {
        query = query.eq("search", search);
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

      return data || [];
    },
  });
}
