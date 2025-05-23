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
import { useRouter } from "expo-router";
import { ScrollView } from "react-native-gesture-handler";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSuspenseQuery } from "@tanstack/react-query";

import {
  PreferenceData,
  preferenceSchema,
} from "@/schemas/personal/preference";
import language from "@/language";

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
        <Header title={language.page.personal.preferences.title} />

        <Suspense fallback={<PersonalPreferencesLoading />}>
          <PersonalPreferencesForm user={user} />
        </Suspense>
      </View>
    </ScrollView>
  );
}

function PersonalPreferencesLoading() {
  return <ProductStatus status={language.page.personal.preferences.loading} />;
}

type PersonalPreferencesFormProps = {
  user: User;
};

function PersonalPreferencesForm({ user }: PersonalPreferencesFormProps) {
  const router = useRouter();
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

    router.back();
  };

  return (
    <View style={{ gap: 48 }}>
      <View style={{ gap: 32 }}>
        <InputDropdown
          name="language"
          label={language.page.personal.preferences.input.language}
          control={control}
          options={languages}
          placeholder={
            language.page.personal.preferences.input.languagePlaceholder
          }
        />

        <View>
          <InputLabel label={language.page.personal.preferences.input.system} />

          <InputDropdownRadio
            style={{
              borderBottomLeftRadius: 0,
              borderBottomRightRadius: 0,
            }}
            label={language.page.personal.preferences.input.systemMetric}
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
            label={language.page.personal.preferences.input.systemImperial}
            selected={measurement === "imperial"}
            onSelect={() => {
              setValue("measurement", "imperial");
            }}
          />
        </View>
      </View>

      <Button
        title={language.page.personal.preferences.button}
        onPress={handleSubmit(handleSave)}
        loading={isSubmitting}
        disabled={isSubmitting}
      />
    </View>
  );
}
