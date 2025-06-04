import { View } from "react-native";

import TextBody from "@/components/Text/Body";

import variables from "@/variables";

type ItemHeaderProps = {
  title: string;
  subtitle: string;
};

export default function ItemHeader({ title, subtitle }: ItemHeaderProps) {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",

        paddingVertical: variables.padding.small.vertical,
        paddingHorizontal: variables.padding.page,

        backgroundColor: variables.colors.background.secondary,

        borderBottomColor: variables.border.color,
        borderBottomWidth: 1,
      }}
    >
      <TextBody color={variables.colors.text.secondary} weight="medium">
        {title}
      </TextBody>
      <TextBody color={variables.colors.text.secondary} weight="semibold">
        {subtitle}
      </TextBody>
    </View>
  );
}
