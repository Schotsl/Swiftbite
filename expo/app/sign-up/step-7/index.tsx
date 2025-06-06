import { router } from "expo-router";
import { useRegister } from "@/context/RegisterContext";
import { ScrollView, View } from "react-native";

import React, { useState } from "react";

import Modal from "@/components/Modal";
import Button from "@/components/Button";
import Header from "@/components/Header";
import TextBody from "@/components/Text/Body";
import InputMacro from "@/components/Input/Macro";
import InputCalorie from "@/components/Input/Calorie";
import ButtonOverlay from "@/components/Button/Overlay";
import RegisterSteps from "@/components/Register/Steps";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { GoalData, goalSchema } from "@/schemas/personal/goal";

import variables from "@/variables";

export default function Step7() {
  const [modal, setModal] = useState(true);

  const { setPrevious } = useRegister();

  const { handleSubmit, control } = useForm<GoalData>({
    resolver: zodResolver(goalSchema),
    defaultValues: {
      calories: 2000,
      macro: {
        carbs: 0.45,
        protein: 0.3,
        fat: 0.25,
      },
    },
  });

  const handleNext = () => {
    setPrevious(7);
    router.replace("/sign-up/step-8");
  };

  const handleBack = () => {
    setPrevious(7);
    router.replace("/sign-up/step-6");
  };

  const handleClose = () => {
    setModal(false);
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
          <RegisterSteps value={7} total={8} />

          <Header
            onBack={handleBack}
            title="Voedingsdoel"
            content="Dit is je dagelijkse voedingsdoel voor spieropbouw. We hebben het eiwitgehalte verhoogd voor herstel en groei, en stemmen de calorieën af op je lengte, gewicht, leeftijd en activiteitsniveau"
          />

          <InputCalorie name="calories" label="Calorie" control={control} />

          <InputMacro
            name="macro"
            label="Eiwit"
            control={control}
            calories={2000}
          />
        </View>
      </ScrollView>

      <ButtonOverlay
        title="Volgende stap"
        navigation={false}
        onPress={handleSubmit(handleNext)}
      />

      <Modal
        title="Onveilig doel"
        visible={modal}
        button="Vind alternatieven"
        onClose={handleClose}
        onButton={() => {}}
      >
        <View style={{ gap: variables.gap.normal }}>
          <TextBody weight="medium">
            Het doel dat je hebt ingesteld ligt onder de minimaal aanbevolen
            hoeveelheid calorieën per dag. Dit kan schadelijk zijn voor je
            gezondheid.
          </TextBody>

          <TextBody>
            We raden aan om dit te heroverwegen of te overleggen met een arts of
            diëtist. Als je een eetstoornis hebt, raden we je aan
            gespecialiseerde apps te gebruiken die zijn ontworpen om je hierbij
            te ondersteunen.
          </TextBody>
        </View>
      </Modal>
    </View>
  );
}
