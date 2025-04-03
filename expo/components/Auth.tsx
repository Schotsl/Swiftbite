import * as AppleAuthentication from "expo-apple-authentication";
import React, { useState } from "react";
import {
  Alert,
  AppState,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Button from "@/app/components/Button";
import Input from "@/app/components/Input";
import { handleError } from "@/helper";

import supabase from "../utils/supabase";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");

  AppState.addEventListener("change", (state) => {
    if (state === "active") {
      supabase.auth.startAutoRefresh();
    } else {
      supabase.auth.stopAutoRefresh();
    }
  });

  async function signInWithEmail() {
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    handleError(error);
    setLoading(false);
  }

  async function signUpWithEmail() {
    setLoading(true);

    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    handleError(error);

    if (!session) {
      Alert.alert("Please check your inbox for email verification!");
    }

    setLoading(false);
  }

  return (
    <SafeAreaView
      style={{
        gap: 16,
        padding: 16,
      }}
    >
      <View style={{ gap: 16 }}>
        <Input value={email} onChange={setEmail} placeholder="E-mail" />

        <Input
          value={password}
          password={true}
          onChange={setPassword}
          placeholder="Password"
        />
      </View>

      <View style={{ gap: 16 }}>
        <Button
          title="Sign in"
          onPress={() => signInWithEmail()}
          disabled={loading}
          loading={loading}
        />

        <Button
          title="Sign up"
          onPress={() => signUpWithEmail()}
          disabled={loading}
          loading={loading}
        />

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
            } catch (e) {
              if (e.code === "ERR_REQUEST_CANCELED") {
                // handle that the user canceled the sign-in flow
              } else {
                // handle other errors
              }
            }
          }}
        />
      </View>
    </SafeAreaView>
  );
}
