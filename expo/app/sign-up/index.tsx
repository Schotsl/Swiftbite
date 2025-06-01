import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "expo-router";
import React from "react";
import { useForm } from "react-hook-form";
import { Alert, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import useSignUpWithEmail from "@/mutations/useSignUpWithEmail";
import { AuthData, authSchema } from "@/schemas/auth";

import Button from "../../components/Button";
import Input from "../../components/Input";
import TextTitle from "@/components/Text/Title";
import TextBody from "@/components/Text/Body";

export default function SignUp() {
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
    <SafeAreaView style={{ flex: 1 }} edges={["right", "left", "top"]}>
      <View style={{ flex: 1, justifyContent: "center", gap: 16 }}>
        <TextTitle>Create Account</TextTitle>

        <Input
          name="email"
          type="email-address"
          control={control}
          placeholder="E-mail"
        />

        <Input
          type="password"
          name="password"
          control={control}
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
          <TextBody>Already have an account? </TextBody>

          <Link href="/sign-in" asChild>
            <TextBody color="#0891b2" weight="medium">
              Sign in
            </TextBody>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
}
