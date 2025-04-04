import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import Button from "@/components/Button";
import { handleError } from "@/helper";
import supabase from "@/utils/supabase";

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
    <View style={styles.container}>
      <Text>Settings</Text>
      <Button
        title="Sign out"
        onPress={handleSignout}
        disabled={isLoading}
        loading={isLoading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
