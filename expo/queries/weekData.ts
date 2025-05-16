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
    // Set timer until midnight and then revalidate every 24 hours
    staleTime: getRemaining(),
    gcTime: 86400000,
  });
}

function getRemaining(): number {
  const dateNow = new Date();
  const dateMidnight = new Date(dateNow);

  dateMidnight.setHours(24, 0, 0, 0);

  const timeNow = dateNow.getTime();
  const timeMidnight = dateMidnight.getTime();

  return timeMidnight - timeNow;
}
