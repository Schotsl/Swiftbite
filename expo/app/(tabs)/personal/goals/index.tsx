import Header from "@/components/Header";
import InputMacro from "@/components/Input/Macro";
import InputCalorie from "@/components/Input/Calorie";
import ButtonOverlay from "@/components/Button/Overlay";

import useUpdateUser from "@/mutations/useUpdateUser";
import userData from "@/queries/userData";

import { View } from "react-native";
import { Fragment } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { ScrollView } from "react-native-gesture-handler";
import { zodResolver } from "@hookform/resolvers/zod";
import { Control, useForm } from "react-hook-form";
import { GoalData, goalSchema } from "@/schemas/personal/goal";

import language from "@/language";
import variables from "@/variables";
import Empty from "@/components/Empty";

export default function PersonalGoals() {
  const { data: user, isLoading } = useQuery(userData());

  const router = useRouter();

  const updateUser = useUpdateUser();

  const {
    watch,
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = useForm<GoalData>({
    resolver: zodResolver(goalSchema),
    defaultValues: user,
  });

  const handleSave = (data: GoalData) => {
    // If we switch to suspense we can remove this check
    if (!user) {
      return;
    }

    updateUser.mutate({ ...user, ...data });

    router.back();
  };

  const calories = watch("calories");

  return (
    <View>
      <ScrollView>
        <View
          style={{
            gap: variables.gap.large,
            padding: variables.padding.page,
            paddingBottom: variables.paddingOverlay,
          }}
        >
          <Header title={language.page.personal.goals.title} />

          {isLoading ? (
            <PersonalGoalsLoading />
          ) : (
            <PersonalGoalsForm control={control} calories={calories} />
          )}
        </View>
      </ScrollView>

      <ButtonOverlay
        title={language.page.personal.goals.button}
        onPress={handleSubmit(handleSave)}
        loading={isSubmitting || isLoading}
        disabled={isSubmitting || isLoading}
      />
    </View>
  );
}

function PersonalGoalsLoading() {
  return (
    <Empty
      emoji="🔎"
      active={true}
      content={language.page.personal.goals.loading}
    />
  );
}

type PersonalGoalsFormProps = {
  control: Control<GoalData>;
  calories: number;
};

function PersonalGoalsForm({ control, calories }: PersonalGoalsFormProps) {
  return (
    <Fragment>
      <InputCalorie
        name="calories"
        label={language.page.personal.goals.input.calories}
        control={control}
      />

      <InputMacro
        name="macro"
        label={language.page.personal.goals.input.macros}
        control={control}
        calories={calories}
      />
    </Fragment>
  );
}
