import { router } from "expo-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRegister } from "@/context/RegisterContext";
import { ScrollView, Alert, View } from "react-native";
import { Step1Data, step1Schema } from "@/schemas/register/step-1";

import React, { useEffect } from "react";
import Input from "@/components/Input";
import Header from "@/components/Header";
import RegisterSteps from "@/components/Register/Steps";
import ButtonOverlay from "@/components/Button/Overlay";

import variables from "@/variables";
import language from "@/language";

export default function Step1() {
  useEffect(() => {
    Alert.alert(language.alert.demo.title, language.alert.demo.subtitle);
  }, []);

  const { setLast, setFirst, setPrevious } = useRegister();

  const { control, handleSubmit } = useForm<Step1Data>({
    resolver: zodResolver(step1Schema),
  });

  const handleNext = (data: Step1Data) => {
    setFirst(data.first_name.trim());
    setLast(data.last_name.trim());

    setPrevious(1);

    router.replace("/sign-up/step-2");
  };

  const handleBack = () => {
    setPrevious(1);

    router.replace("/sign-in");
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
          <RegisterSteps value={1} total={8} />

          <Header
            onBack={handleBack}
            title="Voor- en achternaam"
            content="We gebruiken je voor- en achternaam alleen om je aan te spreken in de app"
          />

          <View style={{ gap: 16 }}>
            <Input
              type="default"
              name="first_name"
              label={"Voornaam"}
              control={control}
              placeholder={"John"}
            />

            <Input
              type="default"
              name="last_name"
              label={"Achternaam"}
              control={control}
              placeholder={"Doe"}
            />
          </View>
        </View>
      </ScrollView>

      <ButtonOverlay
        title="Volgende stap"
        navigation={false}
        onPress={handleSubmit(handleNext)}
      />
    </View>
  );
}
