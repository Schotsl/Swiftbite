import { router } from "expo-router";
import { View } from "react-native";

import React from "react";
import Steps from "@/components/Steps";
import Button from "@/components/Button";
import Header from "@/components/Header";

import { useRegister } from "@/context/RegisterContext";

import variables from "@/variables";

export default function Step8() {
  const { setPrevious } = useRegister();

  const handleNext = () => {
    setPrevious(8);
    // router.replace("/sign-up/step-9");
  };

  const handleBack = () => {
    setPrevious(8);
    router.replace("/sign-up/step-7");
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
      <Steps value={8} total={8} />

      <Header onBack={handleBack} title="Accountgegevens" />

      <View style={{ marginTop: "auto" }}>
        <Button title={"Volgende stap"} onPress={handleNext} />
      </View>
    </View>
  );
}
