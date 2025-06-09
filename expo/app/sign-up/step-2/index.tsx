import { router } from "expo-router";
import { Picker } from "@react-native-picker/picker";
import { useRegister } from "@/context/RegisterContext";
import { ScrollView, View } from "react-native";

import React from "react";
import Header from "@/components/Header";
import TextLarge from "@/components/Text/Large";
import ButtonOverlay from "@/components/Button/Overlay";
import RegisterSteps from "@/components/Register/Steps";
import RegisterSwitch from "@/components/Register/Switch";

import variables from "@/variables";
import language from "@/language";

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
          <RegisterSteps value={2} total={8} />

          <Header
            title="Lengte en gewicht"
            content="Met deze gegevens schatten we je dagelijkse energie- en macro­behoefte in"
            onBack={handleBack}
          />

          <Step2Switcher />

          <View style={{ flexDirection: "row" }}>
            <Step2Weight />
            <Step2Length />
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

function Step2Switcher() {
  return (
    <View style={{ flexDirection: "row" }}>
      <View style={{ flex: 1 }}>
        <TextLarge weight="semibold" align="center">
          Pond
        </TextLarge>
      </View>

      <RegisterSwitch />

      <View style={{ flex: 1 }}>
        <TextLarge weight="semibold" align="center">
          Kilo
        </TextLarge>
      </View>
    </View>
  );
}

function Step2Weight() {
  const { weight, setWeight } = useRegister();

  const weights = Array.from({ length: 2010 }, (_, i) => i / 10 + 50);

  return (
    <View style={{ flex: 1, marginRight: -8 }}>
      <TextLarge weight="semibold" align="center">
        Gewicht
      </TextLarge>

      <Picker
        selectedValue={weight}
        onValueChange={(value) => setWeight(value!)}
      >
        {weights.map((option) => (
          <Picker.Item
            key={option}
            value={option}
            label={`${option.toFixed(1)} ${language.measurement.metric.weight}`}
          />
        ))}
      </Picker>
    </View>
  );
}

function Step2Length() {
  const { length, setLength } = useRegister();

  const lengths = Array.from({ length: 200 }, (_, i) => i + 50);

  return (
    <View style={{ flex: 1, marginLeft: -8 }}>
      <TextLarge weight="semibold" align="center">
        Lengte
      </TextLarge>

      <Picker
        selectedValue={length}
        onValueChange={(value) => setLength(value!)}
      >
        {lengths.map((option) => (
          <Picker.Item
            key={option}
            value={option}
            label={`${option} ${language.measurement.metric.distance}`}
          />
        ))}
      </Picker>
    </View>
  );
}
