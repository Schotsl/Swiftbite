// HAPPY

import { View } from "react-native";

import TextSmall from "@/components/Text/Small";
import TextTitle from "@/components/Text/Title";

type EmptyProps = {
  emoji: string;
  content: string;
};

export default function Empty({ emoji, content }: EmptyProps) {
  return (
    <View
      style={{
        gap: 4,
        flex: 1,
        minHeight: "100%",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <TextTitle>{emoji}</TextTitle>
      <TextSmall
        align="center"
        weight="medium"
        style={{
          maxWidth: 250,
        }}
      >
        {content}
      </TextSmall>
    </View>
  );
}
