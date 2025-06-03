import { router } from "expo-router";
import { View } from "react-native";

import React from "react";
import Steps from "@/components/Steps";
import Button from "@/components/Button";
import Header from "@/components/Header";

import { useRegister } from "@/context/RegisterContext";

import variables from "@/variables";

export default function Step3() {
  const { setPrevious } = useRegister();

  const handleNext = () => {
    setPrevious(3);
    router.replace("/sign-up/step-4");
  };

  const handleBack = () => {
    setPrevious(3);
    router.replace("/sign-up/step-2");
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
      <Steps value={3} total={8} />

      <Header
        onBack={handleBack}
        title="Leeftijd"
        content="Je leeftijd beïnvloedt je verbranding. Zo krijgen we een beter beeld van je calorie­doel"
      />

      <View style={{ marginTop: "auto" }}>
        <Button title={"Volgende stap"} onPress={handleNext} />
      </View>
    </View>
  );
}
