import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "expo-router";
import React from "react";
import { useForm } from "react-hook-form";
import { Alert, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import useSignUpWithEmail from "../mutations/useSignUpWithEmail";
import { AuthData, authSchema } from "../schemas/auth";
import Button from "./components/Button";
import Input from "./components/Input";

export default function SignUpScreen() {
  const signUpMutation = useSignUpWithEmail();

  const isLoading = signUpMutation.isPending;

  const { control, handleSubmit, setError } = useForm<AuthData>({
    resolver: zodResolver(authSchema),
  });

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
          Create Account
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
          title="Sign up"
          onPress={handleSubmit(handleSignUp)}
          disabled={isLoading}
          loading={isLoading}
        />

        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            marginTop: 16,
          }}
        >
          <Text>Already have an account? </Text>
          <Link href="/sign-in" asChild>
            <Text style={{ color: "#0891b2", fontWeight: "500" }}>Sign in</Text>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
}
