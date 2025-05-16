import supabase from "@/utils/supabase";

import { User } from "@/types";
import { handleError } from "@/helper";
import { queryOptions } from "@tanstack/react-query";
import { Weight } from "@/schemas/personal/health";

export default function userData() {
  return queryOptions({
    queryKey: ["userData"],
    queryFn: async () => {
      const { data: authData, error: authError } =
        await supabase.auth.getUser();

      handleError(authError);

      const { error: userError, data: userData } = await supabase
        .from("user")
        .select(`*`)
        .single();

      handleError(userError);

      // We'll have to cast the Supabase strings into dates
      const birth = new Date(userData.birth);
      const weight = userData.weight.map((weight: Weight) => {
        return {
          date: new Date(weight.date),
          weight: weight.weight,
        };
      });

      const email = authData.user?.email;
      const user = { ...userData, birth, weight, email } as User;

      return user;
    },
  });
}
