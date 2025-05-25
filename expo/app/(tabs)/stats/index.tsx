import Empty from "@/components/Empty";

import language from "@/language";
import variables from "@/variables";

import { View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

export default function Stats() {
  return (
    <ScrollView>
      <View
        style={{
          minHeight: "100%",

          gap: variables.gap.large,
          padding: variables.padding.page,
          paddingBottom: variables.paddingOverlay,
        }}
      >
        <Empty emoji="👷" content={language.page.stats.empty} />
      </View>
    </ScrollView>
  );
}
