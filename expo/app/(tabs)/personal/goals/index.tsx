import Header from "@/components/Header";
import InputMacro from "@/components/Input/Macro";
import InputCalorie from "@/components/Input/Calorie";
import ProductStatus from "@/components/Product/Status";
import ButtonOverlay from "@/components/Button/Overlay";

import useUpdateUser from "@/mutations/useUpdateUser";
import userData from "@/queries/userData";

import { View } from "react-native";
import { useRouter } from "expo-router";
import { ScrollView } from "react-native-gesture-handler";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Control, useForm } from "react-hook-form";
import { Fragment, Suspense } from "react";
import { GoalData, goalSchema } from "@/schemas/personal/goal";

import language from "@/language";
import variables from "@/variables";

export default function PersonalGoals() {
  const { data: user } = useSuspenseQuery(userData());

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
          <Header small={true} title={language.page.personal.goals.title} />

          <Suspense fallback={<PersonalGoalsLoading />}>
            <PersonalGoalsForm control={control} calories={calories} />
          </Suspense>
        </View>
      </ScrollView>

      <ButtonOverlay
        title={language.page.personal.goals.button}
        onPress={handleSubmit(handleSave)}
        loading={isSubmitting}
        disabled={isSubmitting}
      />
    </View>
  );
}

function PersonalGoalsLoading() {
  return <ProductStatus status={language.page.personal.goals.loading} />;
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
