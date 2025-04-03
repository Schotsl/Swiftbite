import { zodResolver } from "@hookform/resolvers/zod";
// import * as AppleAuthentication from "expo-apple-authentication";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Alert, AppState, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Button from "@/app/components/Button";
import Input from "@/app/components/Input";
import { handleError } from "@/helper";
import { AuthData, authSchema } from "@/schemas/auth";

import supabase from "../utils/supabase";

export default function Auth() {
  const [loading, setLoading] = useState(false);

  const { control, handleSubmit } = useForm<AuthData>({
    resolver: zodResolver(authSchema),
  });

  const signInWithEmail = async (data: AuthData) => {
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    handleError(error);
    setLoading(false);
  };

  const signUpWithEmail = async (data: AuthData) => {
    setLoading(true);

    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
    });

    handleError(error);

    if (!session) {
      Alert.alert("Please check your inbox for email verification!");
    }

    setLoading(false);
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
          onPress={handleSubmit(signInWithEmail)}
          disabled={loading}
          loading={loading}
        />

        <Button
          title="Sign up"
          onPress={handleSubmit(signUpWithEmail)}
          disabled={loading}
          loading={loading}
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
