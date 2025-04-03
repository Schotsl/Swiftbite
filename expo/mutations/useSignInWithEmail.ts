import { useMutation } from "@tanstack/react-query";

import { handleError } from "../helper";
import { AuthData } from "../schemas/auth";
import supabase from "../utils/supabase";

export default function useSignInWithEmail() {
  return useMutation({
    mutationFn: async ({ email, password }: AuthData) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      console.log(`[Mutation] signed in user`);
    },
    onError: () => {
      console.log(`[Mutation] failed to sign in user`);
    },
  });
}
