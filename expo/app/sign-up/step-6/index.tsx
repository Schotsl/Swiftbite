import { router } from "expo-router";
import { ScrollView, View } from "react-native";
import { useRegister } from "@/context/RegisterContext";

import React from "react";
import Header from "@/components/Header";
import ButtonOverlay from "@/components/Button/Overlay";
import RegisterSteps from "@/components/Register/Steps";
import InputDropdownRadio from "@/components/Input/Dropdown/Radio";

import variables from "@/variables";

export default function Step6() {
  const { setPrevious } = useRegister();

  const handleNext = () => {
    setPrevious(6);
    router.replace("/sign-up/step-7");
  };

  const handleBack = () => {
    setPrevious(6);
    router.replace("/sign-up/step-5");
  };

  return (
    <View>
      <ScrollView>
        <View
          style={{
            gap: variables.gap.large,
            flex: 1,
            padding: variables.padding.page,
            paddingBottom: variables.gap.large,
          }}
        >
          <RegisterSteps value={6} total={8} />

          <Header
            onBack={handleBack}
            title="Gezondheidsdoel"
            content="Met deze informatie verdelen we eiwitten, koolhydraten en vet. De verhouding staat onder elke optie"
          />

          <View style={{ gap: 16 }}>
            <InputDropdownRadio
              label="Afvallen"
              subtitle="35 % carbs, 35 % eiwitten, 30 % vet"
              selected={true}
              onSelect={() => {}}
            />

            <InputDropdownRadio
              label="Gezonder eten"
              subtitle="45 % carbs, 30 % eiwitten, 25 % vet"
              selected={false}
              onSelect={() => {}}
            />

            <InputDropdownRadio
              label="Energie verhogen"
              subtitle="55 % carbs, 25 % eiwitten, 20 % vet"
              selected={false}
              onSelect={() => {}}
            />

            <InputDropdownRadio
              label="Gewicht behouden"
              subtitle="45 % carbs, 25 % eiwitten, 30 % vet"
              selected={false}
              onSelect={() => {}}
            />

            <InputDropdownRadio
              label="Spiermassa opbouwen"
              subtitle="35 % carbs, 40 % eiwitten, 25 % vet"
              selected={false}
              onSelect={() => {}}
            />

            <InputDropdownRadio
              label="Aankomen / bulken"
              subtitle="50 % carbs, 30 % eiwitten, 20 % vet"
              selected={false}
              onSelect={() => {}}
            />
          </View>
        </View>
      </ScrollView>

      <ButtonOverlay
        tab={false}
        nav={false}
        title="Volgende stap"
        onPress={handleNext}
      />
    </View>
  );
}
