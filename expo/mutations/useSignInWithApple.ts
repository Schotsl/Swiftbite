import { useMutation } from "@tanstack/react-query";
import * as AppleAuthentication from "expo-apple-authentication";

import { handleError } from "@/helper";
import supabase from "@/utils/supabase";

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
        const { data: authData, error: authError } =
          await supabase.auth.signInWithIdToken({
            provider: "apple",
            token: credential.identityToken!,
          });

        handleError(authError);

        const { data: userData, error: userError } = await supabase
          .from("user")
          .select("uuid")
          .eq("uuid", authData.user?.id);

        handleError(userError);

        // If the user already exists return the auth data
        if (userData && userData.length > 0) {
          return authData;
        }

        // Otherwise create a new user
        const { error: insertError } = await supabase.from("user").insert({
          uuid: authData.user?.id,
          first_name: credential.fullName?.givenName,
          last_name: credential.fullName?.familyName,
          birth: new Date("2000-01-01"),
          length: 180,
          language: "nl",
          calories: 2500,
          macro: {
            fat: 0.2,
            carbs: 0.45,
            protein: 0.35,
          },
          weight: [
            { date: "2025-06-02T12:00:00.000Z", weight: 75.5 },
            { date: "2025-05-02T12:00:00.000Z", weight: 75 },
          ],
        });

        handleError(insertError);

        return authData;
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
