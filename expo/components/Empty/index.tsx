// HAPPY

import { View } from "react-native";

import TextBody from "@/components/Text/Body";

type EmptyProps = {
  emoji: string;
  content: string;
};

export default function Empty({ emoji, content }: EmptyProps) {
  return (
    <View
      style={{
        flex: 1,
        minHeight: "100%",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <TextBody
        weight="medium"
        style={{
          maxWidth: 250,
          textAlign: "center",
        }}
      >
        {emoji}
        {content}
      </TextBody>
    </View>
  );
}
