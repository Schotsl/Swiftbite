import { router } from "expo-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRegister } from "@/context/RegisterContext";
import { Step8Data, step8Schema } from "@/schemas/register/step-8";
import { ScrollView, TouchableOpacity, View } from "react-native";

import React from "react";
import Input from "@/components/Input";
import Button from "@/components/Button";
import Header from "@/components/Header";
import Divider from "@/components/Divider";
import TextBody from "@/components/Text/Body";
import RegisterSteps from "@/components/Register/Steps";

import language from "@/language";
import variables from "@/variables";

export default function Step8() {
  const { setPrevious } = useRegister();

  const { control } = useForm<Step8Data>({
    resolver: zodResolver(step8Schema),
  });

  const handleBack = () => {
    setPrevious(8);
    router.replace("/sign-up/step-7");
  };

  return (
    <ScrollView>
      <View
        style={{
          gap: variables.gap.large,
          flex: 1,
          padding: variables.padding.page,
          paddingBottom: variables.gap.large,
        }}
      >
        <RegisterSteps value={8} total={8} />

        <Header onBack={handleBack} title="Accountgegevens" />

        <View style={{ gap: 32 }}>
          <Input
            name="email"
            type="email-address"
            label={language.input.email.title}
            control={control}
            placeholder={language.input.email.placeholder}
          />

          <View style={{ gap: 16 }}>
            <Input
              type="password"
              name="password"
              label={language.input.password.title}
              control={control}
              placeholder={language.input.password.placeholder}
            />

            <Input
              type="password"
              name="password_repeat"
              label="Herhaal wachtwoord"
              control={control}
              placeholder={language.input.password.placeholder}
            />
          </View>
        </View>

        <View style={{ marginTop: "auto", gap: 20 }}>
          <Button title={"Registreer met e-mail"} onPress={() => {}} />

          <Divider />

          <Button
            icon="apple"
            title={"Registreer met Apple"}
            onPress={() => {}}
          />

          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
            }}
          >
            <TextBody weight="medium">Heb je al een account? </TextBody>

            <TouchableOpacity onPress={() => {}}>
              <TextBody color={variables.colors.primary} weight="medium">
                Log in
              </TextBody>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
