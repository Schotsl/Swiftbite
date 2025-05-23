import Header from "@/components/Header";
import ButtonOverlay from "@/components/Button/Overlay";

import language from "@/language";

import { Alert, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

export default function PersonalExport() {
  const handleExport = () => {
    Alert.alert(
      language.page.personal.export.alert.title,
      language.page.personal.export.alert.content,
    );
  };

  return (
    <ScrollView>
      <View style={{ flex: 1, padding: 32 }}>
        <Header
          title={language.page.personal.export.title}
          content={language.page.personal.export.content}
        />

        <ButtonOverlay
          title={language.page.personal.export.button}
          onPress={handleExport}
        />
      </View>
    </ScrollView>
  );
}
