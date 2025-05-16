import supabase from "@/utils/supabase";

import { handleError } from "@/helper";
import { queryOptions } from "@tanstack/react-query";

export default function weekData() {
  return queryOptions({
    queryKey: ["weekData"],
    queryFn: async (): Promise<number> => {
      const session = await supabase.auth.getSession();
      const userId = session.data.session?.user.id;

      const { data, error } = await supabase.rpc("streak_week", {
        param_user_id: userId,
      });

      handleError(error);

      console.log(`[Query] fetched week`);
      console.log(data);
      return data;
    },
  });
}
