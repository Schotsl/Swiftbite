import Button from "@/components/Button";
import Header from "@/components/Header";
import InputMacro from "@/components/Input/Macro";
import InputCalorie from "@/components/Input/Calorie";
import ProductStatus from "@/components/Product/Status";

import useUpdateUser from "@/mutations/useUpdateUser";
import userData from "@/queries/userData";

import { User } from "@/types/user";
import { View } from "react-native";
import { useForm } from "react-hook-form";
import { Suspense } from "react";
import { useRouter } from "expo-router";
import { ScrollView } from "react-native-gesture-handler";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSuspenseQuery } from "@tanstack/react-query";
import { GoalData, goalSchema } from "@/schemas/personal/goal";

export default function PersonalGoals() {
  const { data: user } = useSuspenseQuery(userData());

  return (
    <ScrollView>
      <View style={{ flex: 1, padding: 32 }}>
        <Header title="Verander je doel" />

        <Suspense fallback={<PersonalGoalsLoading />}>
          <PersonalGoalsForm user={user} />
        </Suspense>
      </View>
    </ScrollView>
  );
}

function PersonalGoalsLoading() {
  return (
    <ProductStatus status="We zijn je doelen aan het laden uit onze database" />
  );
}

type PersonalGoalsFormProps = {
  user: User;
};

function PersonalGoalsForm({ user }: PersonalGoalsFormProps) {
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
    <View style={{ gap: 48 }}>
      <InputCalorie name="calories" label="Calorie" control={control} />

      <InputMacro
        name="macro"
        label="Je macronutriënten"
        control={control}
        calories={calories}
      />

      <Button
        title="Wijzigen opslaan"
        onPress={handleSubmit(handleSave)}
        loading={isSubmitting}
        disabled={isSubmitting}
      />
    </View>
  );
}
