import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { Alert, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Button from "@/app/components/Button";
import Input from "@/app/components/Input";
import { AuthData, authSchema } from "@/schemas/auth";

import useSignInWithApple from "../mutations/useSignInWithApple";
import useSignInWithEmail from "../mutations/useSignInWithEmail";
import useSignUpWithEmail from "../mutations/useSignUpWithEmail";

export default function Auth() {
  const signInMutation = useSignInWithEmail();
  const signUpMutation = useSignUpWithEmail();
  const signInWithAppleMutation = useSignInWithApple();

  const isLoading =
    signInMutation.isPending ||
    signUpMutation.isPending ||
    signInWithAppleMutation.isPending;

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
  };

  const handleSignUp = async (data: AuthData) => {
    try {
      const result = await signUpMutation.mutateAsync(data);

      if (result && !result.session) {
        Alert.alert("Please check your inbox for email verification!");
      }
    } catch (error: any) {
      const errorMessage = error?.message;

      setError("email", { type: "custom" });
      setError("password", { type: "custom", message: errorMessage });
    }
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
  };

  return (
    <SafeAreaView
      style={{
        gap: 16,
        padding: 16,
      }}
    >
      <View style={{ gap: 16 }}>
        <Input control={control} name="email" placeholder="E-mail" />

        <Input
          control={control}
          name="password"
          password={true}
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
          title="Sign up"
          onPress={handleSubmit(handleSignUp)}
          disabled={isLoading}
          loading={signUpMutation.isPending}
        />

        <Button
          title="Sign in with Apple"
          onPress={handleAppleSignIn}
          disabled={isLoading}
          loading={signInWithAppleMutation.isPending}
        />
      </View>
    </SafeAreaView>
  );
}
