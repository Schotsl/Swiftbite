import { handleError } from "@/helper";
import { useMutation } from "@tanstack/react-query";
import { DeleteData } from "@/schemas/personal/delete";

import supabase from "@/utils/supabase";

export default function useDeleteAccount() {
  return useMutation({
    mutationFn: async ({ password }: DeleteData): Promise<boolean> => {
      const session = await supabase.auth.getSession();
      const user_id = session.data.session?.user.id;

      const { data, error } = await supabase.rpc("delete_account", {
        user_id,
        password,
      });

      handleError(error);

      return data === "success";
    },
  });
}
