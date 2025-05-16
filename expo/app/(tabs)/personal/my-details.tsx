import useUpdateUser from "@/mutations/useUpdateUser";
import userData from "@/queries/userData";

import Button from "@/components/Button";
import Header from "@/components/Header";
import Input from "@/components/Input";
import InputDate from "@/components/Input/Date";

import { View } from "react-native";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { ScrollView } from "react-native-gesture-handler";
import { zodResolver } from "@hookform/resolvers/zod";
import { DetailsData, detailsSchema } from "@/schemas/personal/details";

export default function MyDetails() {
  const router = useRouter();

  const updateUser = useUpdateUser();

  const [isLoading, setIsLoading] = useState(false);

  const { data: user } = useQuery(userData());
  const { control, handleSubmit } = useForm<DetailsData>({
    resolver: zodResolver(detailsSchema),
    defaultValues: user,
  });

  const handleSave = (data: DetailsData) => {
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
        <Header title="Mijn gegevens" />

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
            loading={isLoading}
            disabled={isLoading}
          />
        </View>
      </View>
    </ScrollView>
  );
}
