import supabase from "@/utils/supabase";

import { User } from "@/types";
import { handleError } from "@/helper";
import { queryOptions } from "@tanstack/react-query";
import { Weight } from "@/schemas/personal/health";

export default function userData() {
  return queryOptions({
    queryKey: ["userData"],
    queryFn: async () => {
      const { error, data } = await supabase.from("user").select(`*`).single();

      handleError(error);

      // We'll have to cast the Supabase strings into dates
      const birth = new Date(data.birth);
      const weight = data.weight.map((weight: Weight) => {
        return {
          date: new Date(weight.date),
          weight: weight.weight,
        };
      });

      const user = { ...data, birth, weight } as User;

      return user;
    },
  });
}
