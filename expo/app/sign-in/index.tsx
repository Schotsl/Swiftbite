import { router } from "expo-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthData, authSchema } from "@/schemas/auth";
import { Alert, TouchableOpacity, View } from "react-native";

import useSignInWithApple from "@/mutations/useSignInWithApple";
import useSignInWithEmail from "@/mutations/useSignInWithEmail";

import React from "react";
import Input from "@/components/Input";
import Button from "@/components/Button";
import Divider from "@/components/Divider";
import Text from "@/components/Text";
import TextBody from "@/components/Text/Body";

import language from "@/language";
import variables from "@/variables";

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

    router.replace("/(tabs)/add");
  };

  const handleAppleSignIn = async () => {
    try {
      await signInWithAppleMutation.mutateAsync();
    } catch (error: any) {
      setError("email", { type: "custom" });
      setError("password", {
        type: "custom",
        message: error?.message || language.page.signIn.login.apple,
      });
    }

    router.replace("/(tabs)/add");
  };

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["right", "left", "top"]}>
      <View
        style={{
          gap: variables.gap.large,
          flex: 1,
          padding: variables.padding.page,
          paddingBottom: 48,
        }}
      >
        <Text size={32} weight="semibold">
          {language.page.signIn.login.login}
        </Text>

        <View style={{ gap: 32 }}>
          <Input
            name="email"
            type="email-address"
            label={language.input.email.title}
            control={control}
            placeholder={language.input.email.placeholder}
          />

          <Input
            type="password"
            name="password"
            label={language.input.password.title}
            control={control}
            content={language.page.signIn.forgot}
            placeholder={language.input.password.placeholder}
            onContent={() => {
              Alert.alert(
                language.alert.development.title,
                language.alert.development.subtitle
              );
            }}
          />
        </View>

        <View style={{ marginTop: "auto", gap: 20 }}>
          <Button
            title={language.page.signIn.login.login}
            onPress={handleSubmit(handleSignIn)}
            disabled={isLoading}
            loading={signInMutation.isPending}
          />

          <Divider />

          <Button
            icon="apple"
            title={language.page.signIn.login.apple}
            onPress={handleAppleSignIn}
            disabled={isLoading}
            loading={signInWithAppleMutation.isPending}
          />

          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
            }}
          >
            <TextBody weight="medium">
              {language.page.signIn.register.question}
            </TextBody>
            <TouchableOpacity
              onPress={() =>
                Alert.alert(
                  language.alert.closed.title,
                  language.alert.closed.subtitle
                )
              }
            >
              <TextBody color={variables.colors.primary} weight="medium">
                {language.page.signIn.register.button}
              </TextBody>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
