import { StyleSheet, Text, View } from "react-native";

import { handleError } from "@/helper";
import supabase from "@/utils/supabase";

import Button from "../components/Button";

export default function Tab() {
  async function handleSignout() {
    const { error } = await supabase.auth.signOut();

    handleError(error);
  }

  return (
    <View style={styles.container}>
      <Text>Settings</Text>
      <Button title="Sign out" onPress={handleSignout} />
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
