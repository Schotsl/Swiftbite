import { router } from "expo-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignInData, signInSchema } from "@/schemas/auth";
import { TouchableOpacity, View } from "react-native";

import useSignInWithApple from "@/mutations/useSignInWithApple";
import useSignInWithEmail from "@/mutations/useSignInWithEmail";

import React from "react";
import Input from "@/components/Input";
import Button from "@/components/Button";
import Divider from "@/components/Divider";
import TextBody from "@/components/Text/Body";

import language from "@/language";
import variables from "@/variables";
import Header from "@/components/Header";

export default function SignIn() {
  const signInMutation = useSignInWithEmail();
  const signInWithAppleMutation = useSignInWithApple();

  const isLoading =
    signInMutation.isPending || signInWithAppleMutation.isPending;

  const { control, handleSubmit, setError } = useForm<SignInData>({
    resolver: zodResolver(signInSchema),
  });

  const handleSignIn = async (data: SignInData) => {
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

  const handleReset = () => {
    router.push("/sign-in/password-forgotten");
  };

  return (
    <View
      style={{
        gap: variables.gap.large,
        flex: 1,
        padding: variables.padding.page,
        paddingBottom: variables.gap.large,
      }}
    >
      <Header back={false} title={language.page.signIn.login.login} />

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
          onContent={handleReset}
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

          <TouchableOpacity onPress={() => {}}>
            <TextBody color={variables.colors.primary} weight="medium">
              {language.page.signIn.register.button}
            </TextBody>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
