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

export default function PersonalDetails() {
  const { data: user } = useSuspenseQuery(userData());

  return (
    <ScrollView>
      <View style={{ flex: 1, padding: 32 }}>
        <Header title="Mijn gegevens" />

        <Suspense fallback={<PersonalDetailsLoading />}>
          <PersonalDetailsForm user={user} />
        </Suspense>
      </View>
    </ScrollView>
  );
}

function PersonalDetailsLoading() {
  return (
    <ProductStatus status="We zijn je gegevens aan het laden uit onze database" />
  );
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
          label="E-mail"
          control={control}
          content="Je kunt je e-mail niet wijzigen via dit formulier. Stuur een bericht naar swiftbite@sjorsvanholst.nl voor wijziging."
          disabled={true}
          placeholder="jane@gmail.com"
        />

        <View style={{ gap: 16 }}>
          <Input
            name="first_name"
            label="Voornaam"
            control={control}
            placeholder="Jane"
          />

          <Input
            name="last_name"
            label="Achternaam"
            control={control}
            placeholder="Doe"
          />
        </View>

        <InputDate label="Geboortedatum" name="birth" control={control} />
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
