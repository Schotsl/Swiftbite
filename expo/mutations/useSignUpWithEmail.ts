import { useMutation } from "@tanstack/react-query";

import { handleError } from "@/helper";
import { AuthData } from "@/schemas/auth";
import supabase from "@/utils/supabase";

export default function useSignUpWithEmail() {
  return useMutation({
    mutationFn: async ({ email, password }: AuthData) => {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      handleError(error);
      return data;
    },
    onSuccess: () => {
      console.log(`[Mutation] signed up user`);
    },
    onError: (error) => {
      console.log(`[Mutation] failed to sign up user:`, error);
    },
  });
}
