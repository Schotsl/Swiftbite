import { useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PasswordForgottenData, passwordForgottenSchema } from "@/schemas/auth";
import { Alert, TouchableOpacity, View } from "react-native";

import React from "react";
import Input from "@/components/Input";
import Button from "@/components/Button";
import TextBody from "@/components/Text/Body";

import language from "@/language";
import variables from "@/variables";
import Header from "@/components/Header";

export default function PasswordForgotten() {
  const router = useRouter();

  const { control, handleSubmit } = useForm<PasswordForgottenData>({
    resolver: zodResolver(passwordForgottenSchema),
  });

  const handleReset = async (data: PasswordForgottenData) => {
    router.push("/sign-in/password-success");
  };

  const handleLogin = () => {
    router.push("/sign-in");
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
      <Header
        title="Wachtwoord vergeten"
        content="Vul hieronder je e-mail in en we sturen direct een herstellink"
      />

      <View style={{ gap: 32 }}>
        <Input
          name="email"
          type="email-address"
          label={language.input.email.title}
          control={control}
          placeholder={language.input.email.placeholder}
        />
      </View>

      <View style={{ marginTop: "auto", gap: 20 }}>
        <Button
          title={"Stuur herstellink"}
          onPress={handleSubmit(handleReset)}
        />

        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <TextBody weight="medium">Herinner je je wachtwoord? </TextBody>
          <TouchableOpacity onPress={handleLogin}>
            <TextBody color={variables.colors.primary} weight="medium">
              Log in
            </TextBody>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
