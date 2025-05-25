import Empty from "@/components/Empty";
import Header from "@/components/Header";
import ButtonOverlay from "@/components/Button/Overlay";

import InputLabel from "@/components/Input/Label";
import InputDropdown from "@/components/Input/Dropdown";
import InputDropdownRadio from "@/components/Input/Dropdown/Radio";

import useUpdateUser from "@/mutations/useUpdateUser";
import userData from "@/queries/userData";

import { View } from "react-native";
import { Suspense } from "react";
import { useRouter } from "expo-router";
import { ScrollView } from "react-native-gesture-handler";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSuspenseQuery } from "@tanstack/react-query";
import { UseFormSetValue, Control, useForm } from "react-hook-form";

import {
  PreferenceData,
  preferenceSchema,
} from "@/schemas/personal/preference";

import language from "@/language";
import variables from "@/variables";

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
    <View>
      <ScrollView>
        <View
          style={{
            gap: variables.gap.large,
            padding: variables.padding.page,
            paddingBottom: variables.paddingOverlay,
          }}
        >
          <Header title={language.page.personal.preferences.title} />

          <Suspense fallback={<PersonalPreferencesLoading />}>
            <PersonalPreferencesForm
              control={control}
              measurement={measurement}
              setValue={setValue}
            />
          </Suspense>
        </View>
      </ScrollView>

      <ButtonOverlay
        title={language.page.personal.preferences.button}
        onPress={handleSubmit(handleSave)}
        loading={isSubmitting}
        disabled={isSubmitting}
      />
    </View>
  );
}

function PersonalPreferencesLoading() {
  return (
    <Empty
      emoji="🔎"
      active={true}
      content={language.page.personal.preferences.loading}
    />
  );
}

type PersonalPreferencesFormProps = {
  control: Control<PreferenceData>;
  measurement: string;

  setValue: UseFormSetValue<PreferenceData>;
};

function PersonalPreferencesForm({
  control,
  measurement,

  setValue,
}: PersonalPreferencesFormProps) {
  return (
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
  );
}
