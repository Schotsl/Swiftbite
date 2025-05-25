import Input from "@/components/Input";
import Header from "@/components/Header";
import ButtonOverlay from "@/components/Button/Overlay";

import supabase from "@/utils/supabase";
import useDeleteAccount from "@/mutations/useDeleteAccount";

import { useForm } from "react-hook-form";
import { useRouter } from "expo-router";
import { ScrollView } from "react-native-gesture-handler";
import { handleError } from "@/helper";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, View } from "react-native";
import { DeleteData, deleteSchema } from "@/schemas/personal/delete";

import language from "@/language";
import variables from "@/variables";

export default function PersonalDelete() {
  const router = useRouter();

  const deleteAccount = useDeleteAccount();

  const {
    setError,
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = useForm<DeleteData>({
    resolver: zodResolver(deleteSchema),
  });

  const handleDelete = (data: DeleteData) => {
    Alert.alert(
      language.page.personal.delete.alert.title,
      language.page.personal.delete.alert.content,
      [
        {
          text: language.modifications.uppercase.cancel,
          style: "cancel",
          onPress: handleCancel,
        },
        {
          text: language.modifications.uppercase.delete,
          style: "destructive",
          onPress: () => handleConfirm(data),
        },
      ]
    );
  };

  const handleCancel = () => {
    router.replace("/(tabs)/personal");
  };

  const handleConfirm = async (data: DeleteData) => {
    const success = await deleteAccount.mutateAsync(data);

    if (!success) {
      setError("password", {
        message: language.page.personal.delete.input.passwordIncorrect,
      });

      return;
    }

    const { error } = await supabase.auth.signOut();

    handleError(error);
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
          <Header
            title={language.page.personal.delete.title}
            content={language.page.personal.delete.content}
          />

          <Input
            name="password"
            type="password"
            label={language.page.personal.delete.input.password}
            content={language.page.personal.delete.input.passwordContent}
            control={control}
            placeholder={
              language.page.personal.delete.input.passwordPlaceholder
            }
          />
        </View>
      </ScrollView>

      <ButtonOverlay
        icon="trash"
        title={language.page.personal.delete.button}
        action="delete"
        onPress={handleSubmit(handleDelete)}
        loading={isSubmitting}
        disabled={isSubmitting}
      />
    </View>
  );
}
