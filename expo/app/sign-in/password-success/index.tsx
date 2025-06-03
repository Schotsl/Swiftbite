import { router } from "expo-router";
import { Alert, TouchableOpacity, View } from "react-native";

import React from "react";
import Button from "@/components/Button";
import TextBody from "@/components/Text/Body";

import language from "@/language";
import variables from "@/variables";
import Header from "@/components/Header";

export default function PasswordForgotten() {
  const handleLogin = () => {
    router.replace("/sign-in");
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
        title="E-mail verstuurd"
        content="Als je e-mail bij ons bekend is, krijg je binnen een paar minuten een herstel-link. Controleer je inbox en eventueel je spam"
      />

      <View style={{ marginTop: "auto", gap: 20 }}>
        <Button title={"Log in"} onPress={handleLogin} />

        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <TextBody weight="medium">Herinner je je wachtwoord?</TextBody>

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
