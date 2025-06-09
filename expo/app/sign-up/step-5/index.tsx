import { router } from "expo-router";
import { ScrollView, View } from "react-native";
import { useRegister } from "@/context/RegisterContext";

import React from "react";
import Header from "@/components/Header";
import ButtonOverlay from "@/components/Button/Overlay";
import RegisterSteps from "@/components/Register/Steps";
import InputDropdownRadio from "@/components/Input/Dropdown/Radio";

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
    <View>
      <ScrollView style={{ minHeight: "100%" }}>
        <View
          style={{
            minHeight: "100%",

            gap: variables.gap.large,
            padding: variables.padding.page,
            paddingBottom: variables.paddingOverlayEmpty,
          }}
        >
          <RegisterSteps value={5} total={8} />

          <Header
            onBack={handleBack}
            title="Activiteitsniveau"
            content="Op basis hiervan schatten we je verbruik, onder elke optie zie je hoeveel extra calorieën dat betekent"
          />

          <View style={{ gap: 16 }}>
            <InputDropdownRadio
              label="0 - 2 keer per week"
              subtitle="± 0 kcal per dag"
              selected={true}
              onSelect={() => {}}
            />

            <InputDropdownRadio
              label="3 - 5 keer per week"
              subtitle="+≈ 200 kcal per dag"
              selected={false}
              onSelect={() => {}}
            />

            <InputDropdownRadio
              label="Meer dan 6 keer per week"
              subtitle="+≈ 400 kcal per dag"
              selected={false}
              onSelect={() => {}}
            />
          </View>
        </View>
      </ScrollView>

      <ButtonOverlay
        title="Volgende stap"
        navigation={false}
        onPress={handleNext}
      />
    </View>
  );
}
