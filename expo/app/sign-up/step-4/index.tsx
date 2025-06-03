import { router } from "expo-router";
import { View } from "react-native";

import React from "react";
import Steps from "@/components/Steps";
import Button from "@/components/Button";
import Header from "@/components/Header";

import { useRegister } from "@/context/RegisterContext";

import variables from "@/variables";

export default function Step4() {
  const { setPrevious } = useRegister();

  const handleNext = () => {
    setPrevious(4);
    router.replace("/sign-up/step-5");
  };

  const handleBack = () => {
    setPrevious(4);
    router.replace("/sign-up/step-3");
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
      <Steps value={4} total={8} />

      <Header
        onBack={handleBack}
        title="Apple Health"
        content="Koppel Apple Health en haal meer uit Switchbite. Elke iPhone heeft Apple Health standaard aan boord, dus je hoeft niets extra’s te installeren."
      />

      <View style={{ marginTop: "auto" }}>
        <Button title={"Volgende stap"} onPress={handleNext} />
      </View>
    </View>
  );
}
