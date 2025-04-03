import { zodResolver } from "@hookform/resolvers/zod";
// import * as AppleAuthentication from "expo-apple-authentication";
import React from "react";
import { useForm } from "react-hook-form";
import { Alert, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Button from "@/app/components/Button";
import Input from "@/app/components/Input";
import { AuthData, authSchema } from "@/schemas/auth";

import useSignInWithEmail from "../mutations/useSignInWithEmail";
import useSignUpWithEmail from "../mutations/useSignUpWithEmail";

export default function Auth() {
  const signInMutation = useSignInWithEmail();
  const signUpMutation = useSignUpWithEmail();

  const isLoading = signInMutation.isPending || signUpMutation.isPending;

  const { control, handleSubmit } = useForm<AuthData>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSignIn = async (data: AuthData) => {
    console.log(data);
    signInMutation.mutate(data);
  };

  const handleSignUp = async (data: AuthData) => {
    const result = await signUpMutation.mutateAsync(data);

    if (result && !result.session) {
      Alert.alert("Please check your inbox for email verification!");
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
        {/* 
        <AppleAuthentication.AppleAuthenticationButton
          buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
          buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
          cornerRadius={5}
          onPress={async () => {
            try {
              const credential = await AppleAuthentication.signInAsync({
                requestedScopes: [
                  AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                  AppleAuthentication.AppleAuthenticationScope.EMAIL,
                ],
              });
              // signed in
            } catch (e: unknown) {
              if ((e as any).code === "ERR_REQUEST_CANCELED") {
                // handle that the user canceled the sign-in flow
              } else {
                // handle other errors
              }
            }
          }}
        /> */}
      </View>
    </SafeAreaView>
  );
}
