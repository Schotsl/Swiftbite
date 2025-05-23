import { zodResolver } from "@hookform/resolvers/zod";
import { Link, router } from "expo-router";
import React from "react";
import { useForm } from "react-hook-form";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import useSignInWithApple from "@/mutations/useSignInWithApple";
import useSignInWithEmail from "@/mutations/useSignInWithEmail";
import { AuthData, authSchema } from "@/schemas/auth";

import Button from "../../components/Button";
import Input from "../../components/Input";
import TextTitle from "@/components/Text/Title";
import TextBody from "@/components/Text/Body";

export default function SignIn() {
  const signInMutation = useSignInWithEmail();
  const signInWithAppleMutation = useSignInWithApple();

  const isLoading =
    signInMutation.isPending || signInWithAppleMutation.isPending;

  const { control, handleSubmit, setError } = useForm<AuthData>({
    resolver: zodResolver(authSchema),
  });

  const handleSignIn = async (data: AuthData) => {
    try {
      await signInMutation.mutateAsync(data);
    } catch (error: any) {
      const errorMessage = error?.message;
      setError("email", { type: "custom" });
      setError("password", { type: "custom", message: errorMessage });
    }

    router.push("/");
  };

  const handleAppleSignIn = async () => {
    try {
      await signInWithAppleMutation.mutateAsync();
    } catch (error: any) {
      setError("email", { type: "custom" });
      setError("password", {
        type: "custom",
        message: error?.message || "Failed to sign in with Apple",
      });
    }

    router.push("/");
  };

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["right", "left", "top"]}>
      <View style={{ flex: 1, justifyContent: "center", gap: 16 }}>
        <TextTitle>Sign in</TextTitle>

        <Input control={control} name="email" placeholder="E-mail" />

        <Input
          type="password"
          name="password"
          control={control}
          placeholder="Password"
        />
      </View>

      <View style={{ gap: 16 }}>
        <Button
          title="Sign in"
          onPress={handleSubmit(handleSignIn)}
          disabled={isLoading}
          loading={signInMutation.isPending}
        />

        <Button
          title="Sign in with Apple"
          onPress={handleAppleSignIn}
          disabled={isLoading}
          loading={signInWithAppleMutation.isPending}
        />

        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            marginTop: 16,
          }}
        >
          <TextBody>Don't have an account? </TextBody>
          <Link href="/sign-up" asChild>
            <TextBody color="#0891b2" weight="medium">
              Sign up
            </TextBody>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
}
