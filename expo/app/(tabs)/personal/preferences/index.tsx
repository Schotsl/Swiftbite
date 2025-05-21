import Button from "@/components/Button";
import Header from "@/components/Header";
import InputLabel from "@/components/Input/Label";
import InputDropdown from "@/components/Input/Dropdown";
import InputDropdownRadio from "@/components/Input/Dropdown/Radio";

import useUpdateUser from "@/mutations/useUpdateUser";
import userData from "@/queries/userData";

import { View } from "react-native";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { ScrollView } from "react-native-gesture-handler";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  PreferenceData,
  preferenceSchema,
} from "@/schemas/personal/preference";

const languages = [
  { value: "en", title: "English" },
  { value: "es", title: "Español" },
  { value: "pt", title: "Português" },
  { value: "fr", title: "Français" },
  { value: "de", title: "Deutsch" },
  { value: "nl", title: "Nederlands" },
  { value: "it", title: "Italiano" },
  { value: "ru", title: "Русский" },
  { value: "pl", title: "Polski" },
  { value: "uk", title: "Українська" },
  { value: "ro", title: "Română" },
  { value: "sv", title: "Svenska" },
  { value: "da", title: "Dansk" },
  { value: "fi", title: "Suomi" },
  { value: "no", title: "Norsk" },
  { value: "cs", title: "Čeština" },
  { value: "el", title: "Ελληνικά" },
  { value: "hu", title: "Magyar" },
  { value: "sk", title: "Slovenčina" },
  { value: "hr", title: "Hrvatski" },
];

export default function PersonalPreferences() {
  const router = useRouter();

  const updateUser = useUpdateUser();

  const [isLoading, setIsLoading] = useState(false);

  const { data: user } = useQuery(userData());
  const { control, handleSubmit, setValue, watch } = useForm<PreferenceData>({
    resolver: zodResolver(preferenceSchema),
    defaultValues: user,
  });

  const measurement = watch("measurement");

  const handleSave = (data: PreferenceData) => {
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
        <Header title="Mijn voorkeur" />

        <View style={{ gap: 48 }}>
          <View style={{ gap: 32 }}>
            <InputDropdown
              name="language"
              label="Taal"
              control={control}
              options={languages}
              placeholder="Taal"
            />

            <View>
              <InputLabel label="Meetsysteem" />

              <InputDropdownRadio
                style={{
                  borderBottomLeftRadius: 0,
                  borderBottomRightRadius: 0,
                }}
                label="Metrisch systeem"
                selected={measurement === "metric"}
                onSelect={() => {
                  setValue("measurement", "metric");
                }}
              />

              <InputDropdownRadio
                style={{
                  marginTop: -2,
                  borderTopLeftRadius: 0,
                  borderTopRightRadius: 0,
                }}
                label="Imperial systeem"
                selected={measurement === "imperial"}
                onSelect={() => {
                  setValue("measurement", "imperial");
                }}
              />
            </View>
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
