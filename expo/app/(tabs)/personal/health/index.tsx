import Empty from "@/components/Empty";
import Header from "@/components/Header";
import InputLength from "@/components/Input/Length";
import InputWeights from "@/components/Input/Weights";
import ButtonOverlay from "@/components/Button/Overlay";

import userData from "@/queries/userData";
import useUpdateUser from "@/mutations/useUpdateUser";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { Control, useForm } from "react-hook-form";
import { ScrollView, View } from "react-native";
import { HealthData, healthSchema } from "@/schemas/personal/health";

import language from "@/language";
import variables from "@/variables";

export default function PersonalHealth() {
  const { data: user, isLoading } = useQuery(userData());

  const router = useRouter();

  const updateUser = useUpdateUser();

  const {
    control,
    formState: { isSubmitting },
    reset,
    handleSubmit,
  } = useForm<HealthData>({
    resolver: zodResolver(healthSchema),
  });

  useEffect(() => {
    if (!user) {
      return;
    }

    reset(user);
  }, [user, reset]);

  const handleSave = (data: HealthData) => {
    // If we switch to suspense we can remove this check
    if (!user) {
      return;
    }

    updateUser.mutate({ ...user, ...data });

    router.back();
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
          <Header title={language.page.personal.health.title} />

          {isLoading ? (
            <PersonalHealthLoading />
          ) : (
            <PersonalHealthForm control={control} />
          )}
        </View>
      </ScrollView>

      <ButtonOverlay
        title={language.page.personal.health.button}
        loading={isSubmitting || isLoading}
        disabled={isSubmitting || isLoading}
        onPress={handleSubmit(handleSave)}
      />
    </View>
  );
}

function PersonalHealthLoading() {
  return (
    <Empty
      emoji="🔎"
      active={true}
      content={language.page.personal.health.loading}
    />
  );
}

type PersonalHealthFormProps = {
  control: Control<HealthData>;
};

function PersonalHealthForm({ control }: PersonalHealthFormProps) {
  return (
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
  );
}
