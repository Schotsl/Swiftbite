import { router } from "expo-router";
import { View } from "react-native";

import React from "react";
import Steps from "@/components/Steps";
import Button from "@/components/Button";
import Header from "@/components/Header";

import { useRegister } from "@/context/RegisterContext";

import variables from "@/variables";

export default function Step7() {
  const { setPrevious } = useRegister();

  const handleNext = () => {
    setPrevious(7);
    router.replace("/sign-up/step-8");
  };

  const handleBack = () => {
    setPrevious(7);
    router.replace("/sign-up/step-6");
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
      <Steps value={7} total={8} />

      <Header
        onBack={handleBack}
        title="Voedingsdoel"
        content="Dit is je dagelijkse voedingsdoel voor spieropbouw. We hebben het eiwitgehalte verhoogd voor herstel en groei, en stemmen de calorieën af op je lengte, gewicht, leeftijd en activiteitsniveau"
      />

      <View style={{ marginTop: "auto" }}>
        <Button title={"Volgende stap"} onPress={handleNext} />
      </View>
    </View>
  );
}
