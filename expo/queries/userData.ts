import supabase from "@/utils/supabase";

import { User } from "@/types";
import { handleError } from "@/helper";
import { queryOptions } from "@tanstack/react-query";

export default function userData() {
  return queryOptions({
    queryKey: ["userData"],
    queryFn: async () => {
      const { error, data } = await supabase.from("user").select(`*`).single();

      handleError(error);

      const birth = new Date(data.birth);
      const user = { ...data, birth } as User;

      return user;
    },
  });
}
