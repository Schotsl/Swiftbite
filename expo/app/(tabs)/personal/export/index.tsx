import Header from "@/components/Header";
import ButtonOverlay from "@/components/Button/Overlay";

import language from "@/language";
import variables from "@/variables";

import { ScrollView, Alert, View } from "react-native";

export default function PersonalExport() {
  const handleExport = () => {
    Alert.alert(
      language.page.personal.export.alert.title,
      language.page.personal.export.alert.content,
    );
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
            title={language.page.personal.export.title}
            content={language.page.personal.export.content}
          />
        </View>
      </ScrollView>

      <ButtonOverlay
        title={language.page.personal.export.button}
        onPress={handleExport}
      />
    </View>
  );
}
