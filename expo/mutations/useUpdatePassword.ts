import { handleError } from "@/helper";
import { useMutation } from "@tanstack/react-query";
import { PasswordData } from "@/schemas/personal/password";

import supabase from "@/utils/supabase";

export default function useUpdatePassword() {
  return useMutation({
    mutationFn: async ({
      password,
      password_new,
    }: PasswordData): Promise<boolean> => {
      const session = await supabase.auth.getSession();
      const user_id = session.data.session?.user.id;

      const { data, error } = await supabase.rpc("update_password", {
        user_id,
        password,
        password_new,
      });

      handleError(error);

      return data === "success";
    },
  });
}
