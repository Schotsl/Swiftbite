import Input from "@/components/Input";
import Header from "@/components/Header";
import Button from "@/components/Button";

import useUpdatePassword from "@/mutations/useUpdatePassword";

import { View } from "react-native";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "expo-router";
import { ScrollView } from "react-native-gesture-handler";
import { zodResolver } from "@hookform/resolvers/zod";
import { PasswordData, passwordSchema } from "@/schemas/personal/password";

export default function PersonalPassword() {
  const router = useRouter();

  const updatePassword = useUpdatePassword();

  const [isLoading, setIsLoading] = useState(false);

  const { control, handleSubmit, setError } = useForm<PasswordData>({
    resolver: zodResolver(passwordSchema),
  });

  const handleSave = async (data: PasswordData) => {
    if (isLoading) {
      return;
    }

    setIsLoading(true);

    const success = await updatePassword.mutateAsync(data);

    if (!success) {
      setError("password", { message: "Je huidige wachtwoord is incorrect" });
      setIsLoading(false);

      return;
    }

    router.back();

    setIsLoading(false);
  };

  return (
    <ScrollView>
      <View style={{ flex: 1, padding: 32 }}>
        <Header title="Verander je wachtwoord" />

        <View style={{ gap: 48 }}>
          <View style={{ gap: 32 }}>
            <Input
              name="password"
              type="password"
              label="Je huidige wachtwoord"
              control={control}
              placeholder="*********"
            />

            <View style={{ gap: 16 }}>
              <Input
                name="password_new"
                type="password"
                label="Je nieuwe wachtwoord"
                control={control}
                placeholder="*********"
              />

              <Input
                name="password_new_confirm"
                type="password"
                label="Herhaal je nieuwe wachtwoord"
                control={control}
                placeholder="*********"
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
