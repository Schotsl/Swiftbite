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
import language from "@/language";

export default function PersonalHealth() {
  const { data: user } = useSuspenseQuery(userData());

  return (
    <ScrollView>
      <View style={{ flex: 1, padding: 32 }}>
        <Header title={language.page.personal.health.title} />

        <Suspense fallback={<PersonalHealthLoading />}>
          <PersonalHealthForm user={user} />
        </Suspense>
      </View>
    </ScrollView>
  );
}

function PersonalHealthLoading() {
  return <ProductStatus status={language.page.personal.health.loading} />;
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
        <InputLength
          name="length"
          label={language.page.personal.health.input.height}
          control={control}
        />

        <InputWeights
          name="weight"
          label={language.page.personal.health.input.weight}
          control={control}
        />
      </View>

      <Button
        title={language.page.personal.health.button}
        loading={isSubmitting}
        disabled={isSubmitting}
        onPress={handleSubmit(handleSave)}
      />
    </View>
  );
}
