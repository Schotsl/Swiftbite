import userData from "@/queries/userData";
import useUpdateUser from "@/mutations/useUpdateUser";

import Button from "@/components/Button";
import Header from "@/components/Header";
import Input from "@/components/Input";
import InputDate from "@/components/Input/Date";
import ProductStatus from "@/components/Product/Status";

import { User } from "@/types/user";
import { View } from "react-native";
import { useForm } from "react-hook-form";
import { Suspense } from "react";
import { useRouter } from "expo-router";
import { ScrollView } from "react-native-gesture-handler";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSuspenseQuery } from "@tanstack/react-query";
import { DetailsData, detailsSchema } from "@/schemas/personal/details";
import language from "@/language";

export default function PersonalDetails() {
  const { data: user } = useSuspenseQuery(userData());

  return (
    <ScrollView>
      <View style={{ flex: 1, padding: 32 }}>
        <Header title={language.page.personal.details.title} />

        <Suspense fallback={<PersonalDetailsLoading />}>
          <PersonalDetailsForm user={user} />
        </Suspense>
      </View>
    </ScrollView>
  );
}

function PersonalDetailsLoading() {
  return <ProductStatus status={language.page.personal.details.loading} />;
}

type PersonalDetailsFormProps = {
  user: User;
};

function PersonalDetailsForm({ user }: PersonalDetailsFormProps) {
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
    <View style={{ gap: 48 }}>
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
            placeholder={
              language.page.personal.details.input.lastNamePlaceholder
            }
          />
        </View>

        <InputDate
          name="birth"
          label={language.page.personal.details.input.birth}
          control={control}
        />
      </View>

      <Button
        title={language.page.personal.details.button}
        onPress={handleSubmit(handleSave)}
        loading={isSubmitting}
        disabled={isSubmitting}
      />
    </View>
  );
}
