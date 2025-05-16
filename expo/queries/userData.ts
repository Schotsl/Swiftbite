import supabase from "@/utils/supabase";

import { User } from "@/types";
import { Weight } from "@/schemas/personal/health";
import { handleError } from "@/helper";
import { queryOptions } from "@tanstack/react-query";

export default function userData() {
  return queryOptions({
    queryKey: ["userData"],
    queryFn: async (): Promise<User> => {
      const getEmail = async () => {
        const { data, error } = await supabase.auth.getUser();

        handleError(error);

        return data.user?.email;
      };

      const getUser = async () => {
        const { error, data } = await supabase
          .from("user")
          .select(`*`)
          .single();

        handleError(error);

        return data;
      };

      const getCount = async () => {
        const session = await supabase.auth.getSession();
        const userId = session.data.session?.user.id;

        const { error, data } = await supabase.rpc("entry_count", {
          param_user_id: userId,
        });

        handleError(error);

        return data;
      };

      const [email, user, total] = await Promise.all([
        getEmail(),
        getUser(),
        getCount(),
      ]);

      // We'll have to cast the Supabase strings into dates
      const birth = new Date(user.birth);
      const weight = user.weight.map((weight: Weight) => {
        return {
          date: new Date(weight.date),
          weight: weight.weight,
        };
      });

      return { ...user, birth, weight, email, total };
    },
  });
}
