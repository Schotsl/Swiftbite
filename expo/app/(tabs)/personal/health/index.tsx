import Button from "@/components/Button";
import Header from "@/components/Header";
import InputLength from "@/components/Input/Length";
import InputWeights from "@/components/Input/Weights";
import useUpdateUser from "@/mutations/useUpdateUser";
import userData from "@/queries/userData";
import ProductStatus from "@/components/Product/Status";

import { User } from "@/types/user";
import { View } from "react-native";
import { useForm } from "react-hook-form";
import { Suspense } from "react";
import { useRouter } from "expo-router";
import { ScrollView } from "react-native-gesture-handler";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSuspenseQuery } from "@tanstack/react-query";
import { HealthData, healthSchema } from "@/schemas/personal/health";

export default function PersonalHealth() {
  const { data: user } = useSuspenseQuery(userData());

  return (
    <ScrollView>
      <View style={{ flex: 1, padding: 32 }}>
        <Header title="Mijn gezondheid" />

        <Suspense fallback={<PersonalHealthLoading />}>
          <PersonalHealthForm user={user} />
        </Suspense>
      </View>
    </ScrollView>
  );
}

function PersonalHealthLoading() {
  return (
    <ProductStatus status="We zijn je gezondheidsgegevens aan het laden uit onze database" />
  );
}

type PersonalHealthFormProps = {
  user: User;
};

function PersonalHealthForm({ user }: PersonalHealthFormProps) {
  const router = useRouter();

  const updateUser = useUpdateUser();

  const {
    control,
    formState: { isSubmitting },
    handleSubmit,
  } = useForm<HealthData>({
    resolver: zodResolver(healthSchema),
    defaultValues: user,
  });

  const handleSave = (data: HealthData) => {
    updateUser.mutate({ ...user, ...data });

    router.back();
  };

  return (
    <View style={{ gap: 48 }}>
      <View style={{ gap: 32 }}>
        <InputLength name="length" label="Lengte" control={control} />

        <InputWeights name="weight" label="Gewicht" control={control} />
      </View>

      <Button
        title="Wijzigen opslaan"
        onPress={handleSubmit(handleSave)}
        loading={isSubmitting}
        disabled={isSubmitting}
      />
    </View>
  );
}
