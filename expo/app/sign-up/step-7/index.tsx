import { router } from "expo-router";
import { useRegister } from "@/context/RegisterContext";
import { ScrollView, View } from "react-native";

import React from "react";
import Button from "@/components/Button";
import Header from "@/components/Header";
import InputMacro from "@/components/Input/Macro";
import InputCalorie from "@/components/Input/Calorie";
import ButtonOverlay from "@/components/Button/Overlay";
import RegisterSteps from "@/components/Register/Steps";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { GoalData, goalSchema } from "@/schemas/personal/goal";

import variables from "@/variables";

export default function Step7() {
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

          <View style={{ marginTop: "auto" }}>
            <Button title={"Volgende stap"} onPress={handleNext} />
          </View>
        </View>
      </ScrollView>

      <ButtonOverlay
        tab={false}
        nav={false}
        title="Volgende stap"
        onPress={handleSubmit(handleNext)}
      />
    </View>
  );
}
