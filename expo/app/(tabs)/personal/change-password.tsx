import Header from "@/components/Header";

import { View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

export default function ChangePassword() {
  return (
    <ScrollView>
      <View style={{ gap: 48, flex: 1, padding: 32 }}>
        <Header title="Verander je wachtwoord" />
      </View>
    </ScrollView>
  );
}
