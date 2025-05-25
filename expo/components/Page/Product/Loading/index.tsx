import Empty from "@/components/Empty";
import HeaderLoading from "@/components/Header/Loading";
import ButtonOverlay from "@/components/Button/Overlay";

import { ScrollView, View } from "react-native";

import language from "@/language";
import variables from "@/variables";

type PageProductLoadingProps = {
  editing: boolean;
};

export default function PageProductLoading({
  editing,
}: PageProductLoadingProps) {
  return (
    <View>
      <ScrollView style={{ minHeight: "100%" }}>
        <View
          style={{
            minHeight: "100%",

            gap: variables.gap.large,
            padding: variables.padding.page,
            paddingBottom: variables.paddingOverlay,
          }}
        >
          <HeaderLoading />

          <Empty
            emoji="🔎"
            active={true}
            content={language.types.product.loading}
          />
        </View>
      </ScrollView>

      <ButtonOverlay
        title={
          editing
            ? language.modifications.getSave(language.types.product.single)
            : language.modifications.getInsert(language.types.product.single)
        }
        loading={true}
        disabled={true}
        onPress={() => {}}
      />
    </View>
  );
}
