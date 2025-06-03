import { router } from "expo-router";
import { View } from "react-native";

import React from "react";
import Steps from "@/components/Steps";
import Button from "@/components/Button";
import Header from "@/components/Header";

import { useRegister } from "@/context/RegisterContext";

import variables from "@/variables";

export default function Step5() {
  const { setPrevious } = useRegister();

  const handleNext = () => {
    setPrevious(5);
    router.replace("/sign-up/step-6");
  };

  const handleBack = () => {
    setPrevious(5);
    router.replace("/sign-up/step-4");
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
      <Steps value={5} total={8} />

      <Header
        onBack={handleBack}
        title="Activiteitsniveau"
        content="Op basis hiervan schatten we je verbruik, onder elke optie zie je hoeveel extra calorieën dat betekent"
      />

      <View style={{ marginTop: "auto" }}>
        <Button title={"Volgende stap"} onPress={handleNext} />
      </View>
    </View>
  );
}
