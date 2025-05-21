import Button from "@/components/Button";
import Header from "@/components/Header";
import InputLabel from "@/components/Input/Label";
import InputDropdown from "@/components/Input/Dropdown";
import InputDropdownRadio from "@/components/Input/Dropdown/Radio";
import ProductStatus from "@/components/Product/Status";

import useUpdateUser from "@/mutations/useUpdateUser";
import userData from "@/queries/userData";

import { User } from "@/types/user";
import { View } from "react-native";
import { useForm } from "react-hook-form";
import { Suspense } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
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
  const { data: user } = useSuspenseQuery(userData());

  return (
    <ScrollView>
      <View style={{ flex: 1, padding: 32 }}>
        <Header title="Mijn voorkeur" />

        <Suspense fallback={<PersonalPreferencesLoading />}>
          <PersonalPreferencesForm user={user} />
        </Suspense>
      </View>
    </ScrollView>
  );
}

function PersonalPreferencesLoading() {
  return <ProductStatus status="We zijn je voorkeuren aan het laden..." />;
}

type PersonalPreferencesFormProps = {
  user: User;
};

function PersonalPreferencesForm({ user }: PersonalPreferencesFormProps) {
  const updateUser = useUpdateUser();

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { isSubmitting },
  } = useForm<PreferenceData>({
    resolver: zodResolver(preferenceSchema),
    defaultValues: user,
  });

  const measurement = watch("measurement");

  const handleSave = (data: PreferenceData) => {
    updateUser.mutate({ ...user, ...data });
  };

  return (
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
        loading={isSubmitting}
        disabled={isSubmitting}
      />
    </View>
  );
}
