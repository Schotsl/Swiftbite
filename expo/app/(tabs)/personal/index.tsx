import { View } from "react-native";
import { useState } from "react";
import { handleError } from "@/helper";

import supabase from "@/utils/supabase";
import SettingHeader from "@/components/Setting/Header";

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
    <View style={{ flex: 1, padding: 32 }}>
      <SettingHeader />
    </View>
  );
}
