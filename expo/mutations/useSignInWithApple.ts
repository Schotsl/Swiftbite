import { useMutation } from "@tanstack/react-query";
import * as AppleAuthentication from "expo-apple-authentication";

import { handleError } from "../helper";
import supabase from "../utils/supabase";

export default function useSignInWithApple() {
  return useMutation({
    mutationFn: async () => {
      try {
        // Get credentials from Apple
        const credential = await AppleAuthentication.signInAsync({
          requestedScopes: [
            AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
            AppleAuthentication.AppleAuthenticationScope.EMAIL,
          ],
        });

        // Use the credential to sign in with Supabase
        const { data, error } = await supabase.auth.signInWithIdToken({
          provider: "apple",
          token: credential.identityToken!,
        });

        handleError(error);

        return data;
      } catch (error: any) {
        // Don't propagate cancellation errors
        if (error.code === "ERR_REQUEST_CANCELED") {
          return;
        }

        throw error;
      }
    },
    onSuccess: () => {
      console.log(`[Mutation] signed in with Apple`);
    },
    onError: (error: any) => {
      console.log(`[Mutation] failed to sign in with Apple:`, error);
    },
  });
}
