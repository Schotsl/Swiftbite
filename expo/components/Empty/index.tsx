import { Text, View } from "react-native";

type EmptyProps = {
  emoji: string;
  content: string;
};

export default function Empty({ emoji, content }: EmptyProps) {
  return (
    <View
      style={{
        minHeight: "100%",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text
        style={{
          maxWidth: 200,
          textAlign: "center",

          fontSize: 16,
          fontWeight: "semibold",
        }}
      >
        {emoji}
        {content}
      </Text>
    </View>
  );
}
