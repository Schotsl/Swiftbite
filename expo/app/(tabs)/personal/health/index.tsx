import Header from "@/components/Header";
import InputLength from "@/components/Input/Length";
import InputWeights from "@/components/Input/Weights";
import ProductStatus from "@/components/Product/Status";
import ButtonOverlay from "@/components/Button/Overlay";

import userData from "@/queries/userData";
import useUpdateUser from "@/mutations/useUpdateUser";

import { View } from "react-native";
import { Suspense } from "react";
import { useRouter } from "expo-router";
import { ScrollView } from "react-native-gesture-handler";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Control, useForm } from "react-hook-form";
import { HealthData, healthSchema } from "@/schemas/personal/health";

import language from "@/language";
import variables from "@/variables";

export default function PersonalHealth() {
  const { data: user } = useSuspenseQuery(userData());

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
    <View>
      <ScrollView>
        <View
          style={{
            gap: variables.gap.large,
            padding: variables.padding.page,
            paddingBottom: variables.paddingOverlay,
          }}
        >
          <Header small={true} title={language.page.personal.health.title} />

          <Suspense fallback={<PersonalHealthLoading />}>
            <PersonalHealthForm control={control} />
          </Suspense>
        </View>
      </ScrollView>

      <ButtonOverlay
        title={language.page.personal.health.button}
        loading={isSubmitting}
        disabled={isSubmitting}
        onPress={handleSubmit(handleSave)}
      />
    </View>
  );
}

function PersonalHealthLoading() {
  return <ProductStatus status={language.page.personal.health.loading} />;
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
