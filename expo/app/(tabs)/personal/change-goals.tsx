import Button from "@/components/Button";
import Header from "@/components/Header";
import InputMacro from "@/components/Input/Macro";
import InputCalorie from "@/components/Input/Calorie";

import useUpdateUser from "@/mutations/useUpdateUser";
import userData from "@/queries/userData";

import { View } from "react-native";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { ScrollView } from "react-native-gesture-handler";
import { zodResolver } from "@hookform/resolvers/zod";
import { GoalData, goalSchema } from "@/schemas/personal/goal";

export default function ChangeGoals() {
  const router = useRouter();

  const updateUser = useUpdateUser();

  const [isLoading, setIsLoading] = useState(false);

  const { data: user } = useQuery(userData());
  const { control, watch, handleSubmit } = useForm<GoalData>({
    resolver: zodResolver(goalSchema),
    defaultValues: user,
  });

  const handleSave = (data: GoalData) => {
    if (!user) {
      return;
    }

    if (isLoading) {
      return;
    }

    setIsLoading(true);

    updateUser.mutate({ ...user, ...data });

    router.replace("/(tabs)/personal");

    setIsLoading(false);
  };

  const calories = watch("calories");

  return (
    <ScrollView>
      <View style={{ flex: 1, padding: 32 }}>
        <Header title="Verander je doel" />

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
            loading={isLoading}
            disabled={isLoading}
          />
        </View>
      </View>
    </ScrollView>
  );
}
