import { router } from "expo-router";
import { View } from "react-native";

import React from "react";
import Steps from "@/components/Steps";
import Button from "@/components/Button";
import Header from "@/components/Header";

import { useRegister } from "@/context/RegisterContext";

import variables from "@/variables";

export default function Step2() {
  const { setPrevious } = useRegister();

  const handleNext = () => {
    setPrevious(2);
    router.replace("/sign-up/step-3");
  };

  const handleBack = () => {
    setPrevious(2);
    router.replace("/sign-up/step-1");
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
      <Steps value={2} total={8} />

      <Header
        onBack={handleBack}
        title="Lengte en gewicht"
        content="Met deze gegevens schatten we je dagelijkse energie- en macro­behoefte in"
      />

      <View style={{ marginTop: "auto" }}>
        <Button title={"Volgende stap"} onPress={handleNext} />
      </View>
    </View>
  );
}
