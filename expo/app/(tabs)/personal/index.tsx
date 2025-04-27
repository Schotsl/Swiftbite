import { View } from "react-native";
import { useState } from "react";
import { handleError } from "@/helper";
import { ScrollView } from "react-native-gesture-handler";

import supabase from "@/utils/supabase";
import SettingHeader from "@/components/Setting/Header";
import SettingBlock from "@/components/Setting/Block";

export default function Tab() {
  const [isLoading, setIsLoading] = useState(false);

  async function handleSignout() {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      handleError(error);
      console.log("Signed out successfully");
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <ScrollView>
      <View style={{ gap: 48, flex: 1, padding: 32 }}>
        <SettingHeader />

        <View style={{ gap: 32 }}>
          <SettingBlock
            items={[
              {
                href: "/camera",
                title: "Mijn gegevens",
                content: "Wijzig gegevens zoals voornaam, achternaam, etc.",
              },
              {
                href: "/camera",
                title: "Mijn gezondheid",
                content:
                  "Lichaamsmetingen en -geschiedenis, zoals gewicht en lengte.",
              },
              {
                href: "/camera",
                title: "Mijn voorkeur",
                content: "Verander taal, meetsysteem en andere instellingen.",
              },
            ]}
          />

          <SettingBlock
            items={[
              {
                href: "/camera",
                title: "Verander je wachtwoord",
                content: "Verander je accountwachtwoord.",
              },
              {
                href: "/camera",
                title: "Verander je doel",
                content: "Verander je calorieën of macrodoelen.",
              },
            ]}
          />

          <SettingBlock
            items={[
              {
                href: "/camera",
                title: "Exporteer gegevens",
                content:
                  "Exporteer je dieetdata om te delen met een voedingscoach.",
              },
            ]}
          />

          <SettingBlock
            items={[
              {
                href: "/camera",
                title: "Verwijder je account",
                content: "Verwijder je account definitief.",
              },
            ]}
          />

          <SettingBlock
            items={[
              {
                icon: "arrow-right-from-bracket",
                title: "Uitloggen",
                loading: isLoading,
                content: "Uitloggen van je account.",
                onPress: handleSignout,
              },
            ]}
          />
        </View>
      </View>
    </ScrollView>
  );
}
