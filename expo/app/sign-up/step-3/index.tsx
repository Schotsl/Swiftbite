import { router } from "expo-router";
import { useRegister } from "@/context/RegisterContext";
import { ScrollView, View } from "react-native";

import React from "react";
import Header from "@/components/Header";
import ButtonOverlay from "@/components/Button/Overlay";
import RegisterSteps from "@/components/Register/Steps";
import DateTimePicker from "@react-native-community/datetimepicker";

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
          <RegisterSteps value={3} total={8} />

          <Header
            onBack={handleBack}
            title="Leeftijd"
            content="Je leeftijd beïnvloedt je verbranding. Zo krijgen we een beter beeld van je calorie­doel"
          />

          <DateTimePicker
            mode="date"
            value={new Date()}
            style={{ marginVertical: -16 }}
            display="spinner"
          />
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
