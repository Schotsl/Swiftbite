import { zodResolver } from "@hookform/resolvers/zod";
import { Link, router } from "expo-router";
import React from "react";
import { useForm } from "react-hook-form";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import useSignInWithApple from "@/mutations/useSignInWithApple";
import useSignInWithEmail from "@/mutations/useSignInWithEmail";
import { AuthData, authSchema } from "@/schemas/auth";

import Button from "../components/Button";
import Input from "../components/Input";

export default function SignInScreen() {
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

    router.replace("/");
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

    router.replace("/");
  };

  return (
    <SafeAreaView
      style={{
        gap: 16,
        flex: 1,
        padding: 16,
        backgroundColor: "white",
      }}
    >
      <View style={{ flex: 1, justifyContent: "center", gap: 16 }}>
        <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 16 }}>
          Sign In
        </Text>

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
          <Text>Don't have an account? </Text>
          <Link href="/sign-up" asChild>
            <Text style={{ color: "#0891b2", fontWeight: "500" }}>Sign up</Text>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
}
