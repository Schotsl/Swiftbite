import { router } from "expo-router";
import { useHealth } from "@/context/HealthContext";
import { useRegister } from "@/context/RegisterContext";
import { ScrollView, View } from "react-native";

import React from "react";
import Header from "@/components/Header";
import Button from "@/components/Button";
import TextSmall from "@/components/Text/Small";
import RegisterSteps from "@/components/Register/Steps";
import ButtonOverlay from "@/components/Button/Overlay";

import variables from "@/variables";

export default function Step4() {
  const { setPrevious } = useRegister();
  const { initializeHealth } = useHealth();

  const handleNext = () => {
    setPrevious(4);
    router.replace("/sign-up/step-5");
  };

  const handleBack = () => {
    setPrevious(4);
    router.replace("/sign-up/step-3");
  };

  const handleHealth = async () => {
    await initializeHealth();

    router.replace("/sign-up/step-5");
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
          <RegisterSteps value={4} total={8} />

          <View>
            <Header
              title="Apple Health"
              content="Koppel Apple Health en haal meer uit Switchbite. Elke iPhone heeft Apple Health standaard aan boord, dus je hoeft niets extra's te installeren."
              onBack={handleBack}
            />
            <TextSmall style={{ marginBottom: 16 }}>
              We lezen automatisch je verbrande calorieën uit, passen je dagdoel
              daarop aan en checken op lange termijn of het standaarddoel nog
              klopt.
            </TextSmall>
            <TextSmall style={{ marginBottom: 16 }}>
              Je maaltijden schrijven we terug naar Apple Health, zodat andere
              apps meteen met jouw voeding en macro&apos;s werken
            </TextSmall>
            <Button
              icon="apple"
              style={{ marginTop: variables.gap.normal }}
              title="Koppel Apple Health"
              action="secondary"
              onPress={handleHealth}
            />
          </View>
        </View>
      </ScrollView>

      <ButtonOverlay
        title="Volgende stap"
        action="primary"
        navigation={false}
        onPress={handleNext}
      />
    </View>
  );
}
