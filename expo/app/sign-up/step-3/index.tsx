import { router } from "expo-router";
import { useRegister } from "@/context/RegisterContext";
import { ScrollView, View } from "react-native";

import React from "react";
import Header from "@/components/Header";
import ButtonOverlay from "@/components/Button/Overlay";
import RegisterSteps from "@/components/Register/Steps";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";

import variables from "@/variables";

export default function Step3() {
  const { birth, setBirth, setPrevious } = useRegister();

  const handleNext = () => {
    setPrevious(3);
    router.replace("/sign-up/step-4");
  };

  const handleBack = () => {
    setPrevious(3);
    router.replace("/sign-up/step-2");
  };

  const handleChange = (value: DateTimePickerEvent) => {
    const stamp = value.nativeEvent.timestamp;
    const date = new Date(stamp);

    setBirth(date);
  };

  return (
    <View>
      <ScrollView style={{ minHeight: "100%" }}>
        <View
          style={{
            minHeight: "100%",

            gap: variables.gap.large,
            padding: variables.padding.page,
            paddingBottom: variables.paddingOverlay,
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
            value={birth}
            style={{ marginVertical: -16 }}
            display="spinner"
            onChange={handleChange}
          />
        </View>
      </ScrollView>

      <ButtonOverlay title="Volgende stap" onPress={handleNext} />
    </View>
  );
}
