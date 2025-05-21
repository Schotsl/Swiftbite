import Input from "@/components/Input";
import Button from "@/components/Button";
import Header from "@/components/Header";

import supabase from "@/utils/supabase";
import useDeleteAccount from "@/mutations/useDeleteAccount";

import { useForm } from "react-hook-form";
import { useRouter } from "expo-router";
import { ScrollView } from "react-native-gesture-handler";
import { handleError } from "@/helper";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, View } from "react-native";
import { DeleteData, deleteSchema } from "@/schemas/personal/delete";

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
      "Weet je zeker dat je je account wilt verwijderen?",
      "Dit kan niet worden teruggedraaid.",
      [
        {
          text: "Annuleren",
          style: "cancel",
          onPress: handleCancel,
        },
        {
          text: "Verwijderen",
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
      setError("password", { message: "Je wachtwoord is incorrect" });

      return;
    }

    const { error } = await supabase.auth.signOut();

    handleError(error);
  };

  return (
    <ScrollView>
      <View style={{ flex: 1, padding: 32 }}>
        <Header
          title="Verwijder je account"
          content="Je account verwijderen wist al je gegevens voorgoed. Dit kan niet worden teruggedraaid. Vul je wachtwoord in om te bevestigen."
        />

        <View style={{ gap: 48 }}>
          <Input
            name="password"
            type="password"
            label="Wachtwoord"
            control={control}
            content="Vul hieronder je wachtwoord in om je account te definitief verwijderen."
            placeholder="*********"
          />

          <Button
            icon="trash"
            title="Account verwijderen"
            action="delete"
            onPress={handleSubmit(handleDelete)}
            loading={isSubmitting}
            disabled={isSubmitting}
          />
        </View>
      </View>
    </ScrollView>
  );
}
