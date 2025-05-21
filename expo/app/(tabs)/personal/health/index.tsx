import Button from "@/components/Button";
import Header from "@/components/Header";
import InputLength from "@/components/Input/Length";
import InputWeights from "@/components/Input/Weights";
import useUpdateUser from "@/mutations/useUpdateUser";
import userData from "@/queries/userData";

import { View } from "react-native";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useRouter } from "expo-router";
import { ScrollView } from "react-native-gesture-handler";
import { zodResolver } from "@hookform/resolvers/zod";
import { HealthData, healthSchema } from "@/schemas/personal/health";

export default function PersonalHealth() {
  const router = useRouter();

  const updateUser = useUpdateUser();

  const [isLoading, setIsLoading] = useState(false);

  const { data: user } = useQuery(userData());
  const { control, handleSubmit } = useForm<HealthData>({
    resolver: zodResolver(healthSchema),
    defaultValues: user,
  });

  const handleSave = (data: HealthData) => {
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

  return (
    <ScrollView>
      <View style={{ flex: 1, padding: 32 }}>
        <Header title="Mijn gezondheid" />

        <View style={{ gap: 48 }}>
          <View style={{ gap: 32 }}>
            <InputLength name="length" label="Lengte" control={control} />

            <InputWeights name="weight" label="Gewicht" control={control} />
          </View>

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
