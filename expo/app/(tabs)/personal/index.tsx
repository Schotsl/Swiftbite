import { View, ScrollView } from "react-native";
import { useState } from "react";
import { handleError } from "@/helper";

import supabase from "@/utils/supabase";
import SettingHeader from "@/components/Setting/Header";
import SettingBlock from "@/components/Setting/Block";

import language from "@/language";
import variables from "@/variables";

export default function Personal() {
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
    <View>
      <ScrollView>
        <View
          style={{
            gap: variables.gap.large,
            padding: variables.padding.page,
          }}
        >
          <SettingHeader />

          <View style={{ gap: 32 }}>
            <SettingBlock
              items={[
                {
                  href: "/(tabs)/personal/details",
                  title: language.page.personal.details.title,
                  content: language.page.personal.details.short,
                },
                {
                  href: "/(tabs)/personal/health",
                  title: language.page.personal.health.title,
                  content: language.page.personal.health.short,
                },
                {
                  href: "/(tabs)/personal/preferences",
                  title: language.page.personal.preferences.title,
                  content: language.page.personal.preferences.short,
                },
              ]}
            />

            <SettingBlock
              items={[
                {
                  href: "/(tabs)/personal/password",
                  title: language.page.personal.password.title,
                  content: language.page.personal.password.short,
                },
                {
                  href: "/(tabs)/personal/goals",
                  title: language.page.personal.goals.title,
                  content: language.page.personal.goals.short,
                },
              ]}
            />

            <SettingBlock
              items={[
                {
                  href: "/(tabs)/personal/export",
                  title: language.page.personal.export.title,
                  content: language.page.personal.export.short,
                },
              ]}
            />

            <SettingBlock
              items={[
                {
                  href: "/(tabs)/personal/delete",
                  title: language.page.personal.delete.title,
                  content: language.page.personal.delete.short,
                },
              ]}
            />

            <SettingBlock
              items={[
                {
                  icon: "arrow-right-from-bracket",
                  title: language.page.personal.signout.title,
                  content: language.page.personal.signout.short,
                  loading: isLoading,
                  onPress: handleSignout,
                },
              ]}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
