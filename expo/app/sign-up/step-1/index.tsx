import { router } from "expo-router";
import { View } from "react-native";

import React from "react";
import Steps from "@/components/Steps";
import Button from "@/components/Button";
import Header from "@/components/Header";

import { useRegister } from "@/context/RegisterContext";

import variables from "@/variables";

export default function Step1() {
  const { setPrevious } = useRegister();

  const handleNext = () => {
    setPrevious(1);
    router.replace("/sign-up/step-2");
  };

  const handleBack = () => {
    setPrevious(1);
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
      <Steps value={1} total={8} />

      <Header
        onBack={handleBack}
        title="Voor- en achternaam"
        content="We gebruiken je voor- en achternaam alleen om je aan te spreken in de app"
      />

      <View style={{ marginTop: "auto" }}>
        <Button title={"Volgende stap"} onPress={handleNext} />
      </View>
    </View>
  );
}
