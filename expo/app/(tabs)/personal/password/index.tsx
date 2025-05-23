import Input from "@/components/Input";
import Header from "@/components/Header";
import ButtonOverlay from "@/components/Button/Overlay";

import useUpdatePassword from "@/mutations/useUpdatePassword";

import { View } from "react-native";
import { useForm } from "react-hook-form";
import { useRouter } from "expo-router";
import { ScrollView } from "react-native-gesture-handler";
import { zodResolver } from "@hookform/resolvers/zod";
import { PasswordData, passwordSchema } from "@/schemas/personal/password";

import language from "@/language";
import variables from "@/variables";

export default function PersonalPassword() {
  const router = useRouter();

  const updatePassword = useUpdatePassword();

  const {
    setError,
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = useForm<PasswordData>({
    resolver: zodResolver(passwordSchema),
  });

  const handleSave = async (data: PasswordData) => {
    const success = await updatePassword.mutateAsync(data);

    if (!success) {
      setError("password", {
        message: language.page.personal.password.input.confirmPasswordIncorrect,
      });

      return;
    }

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
          <Header small={true} title={language.page.personal.password.title} />

          <View style={{ gap: 32 }}>
            <Input
              name="password"
              type="password"
              label={language.page.personal.password.input.password}
              control={control}
              placeholder={
                language.page.personal.password.input.passwordPlaceholder
              }
            />

            <View style={{ gap: 16 }}>
              <Input
                name="password_new"
                type="password"
                label={language.page.personal.password.input.newPassword}
                control={control}
                placeholder={
                  language.page.personal.password.input.newPasswordPlaceholder
                }
              />

              <Input
                name="password_new_confirm"
                type="password"
                label={language.page.personal.password.input.confirmPassword}
                control={control}
                placeholder={
                  language.page.personal.password.input
                    .confirmPasswordPlaceholder
                }
              />
            </View>
          </View>
        </View>
      </ScrollView>

      <ButtonOverlay
        title={language.page.personal.password.button}
        onPress={handleSubmit(handleSave)}
        loading={isSubmitting}
        disabled={isSubmitting}
      />
    </View>
  );
}
