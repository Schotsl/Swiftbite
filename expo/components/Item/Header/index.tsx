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

        paddingHorizontal: variables.padding.page,
        paddingVertical: variables.padding.small.vertical,

        backgroundColor: variables.colors.background.secondary,
      }}
    >
      <TextBody color={variables.colors.text.secondary}>{title}</TextBody>
      <TextBody color={variables.colors.text.secondary} weight="semibold">
        {subtitle}
      </TextBody>
    </View>
  );
}
