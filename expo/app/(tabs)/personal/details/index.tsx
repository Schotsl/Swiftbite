import userData from "@/queries/userData";
import useUpdateUser from "@/mutations/useUpdateUser";

import Empty from "@/components/Empty";
import Header from "@/components/Header";
import Input from "@/components/Input";
import InputDate from "@/components/Input/Date";
import ButtonOverlay from "@/components/Button/Overlay";

import { View } from "react-native";
import { Suspense } from "react";
import { useRouter } from "expo-router";
import { ScrollView } from "react-native-gesture-handler";
import { zodResolver } from "@hookform/resolvers/zod";
import { Control, useForm } from "react-hook-form";
import { useSuspenseQuery } from "@tanstack/react-query";
import { DetailsData, detailsSchema } from "@/schemas/personal/details";

import language from "@/language";
import variables from "@/variables";

export default function PersonalDetails() {
  const { data: user } = useSuspenseQuery(userData());

  const router = useRouter();

  const updateUser = useUpdateUser();

  const {
    control,
    formState: { isSubmitting },
    handleSubmit,
  } = useForm<DetailsData>({
    resolver: zodResolver(detailsSchema),
    defaultValues: user,
  });

  const handleSave = (data: DetailsData) => {
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
          <Header small={true} title={language.page.personal.details.title} />

          <Suspense fallback={<PersonalDetailsLoading />}>
            <PersonalDetailsForm control={control} />
          </Suspense>
        </View>
      </ScrollView>

      <ButtonOverlay
        title={language.page.personal.details.button}
        onPress={handleSubmit(handleSave)}
        loading={isSubmitting}
        disabled={isSubmitting}
      />
    </View>
  );
}

function PersonalDetailsLoading() {
  return (
    <Empty
      emoji="🔎"
      active={true}
      content={language.page.personal.details.loading}
    />
  );
}

type PersonalDetailsFormProps = {
  control: Control<DetailsData>;
};

function PersonalDetailsForm({ control }: PersonalDetailsFormProps) {
  return (
    <View style={{ gap: 32 }}>
      <Input
        name="email"
        label={language.page.personal.details.input.email}
        control={control}
        content={language.page.personal.details.input.emailContent}
        placeholder={language.page.personal.details.input.emailPlaceholder}
        disabled={true}
      />

      <View style={{ gap: 16 }}>
        <Input
          name="first_name"
          label={language.page.personal.details.input.firstName}
          control={control}
          placeholder={
            language.page.personal.details.input.firstNamePlaceholder
          }
        />

        <Input
          name="last_name"
          label={language.page.personal.details.input.lastName}
          control={control}
          placeholder={language.page.personal.details.input.lastNamePlaceholder}
        />
      </View>

      <InputDate
        name="birth"
        label={language.page.personal.details.input.birth}
        control={control}
      />
    </View>
  );
}
