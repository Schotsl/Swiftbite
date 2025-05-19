import {
  View,
  Text,
  StyleProp,
  ViewStyle,
  TouchableOpacity,
} from "react-native";

type EmptySmallProps = {
  left?: boolean;
  emoji?: string;
  style?: StyleProp<ViewStyle>;
  content: string;

  onPress: () => void;
};

export default function EmptySmall({
  left = false,
  emoji,
  style,
  content,
  onPress,
}: EmptySmallProps) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View
        style={[
          {
            width: "100%",
            height: 80,
            alignItems: left ? "flex-start" : "center",
            justifyContent: "center",
          },
          style,
        ]}
      >
        <Text
          style={{
            opacity: 0.25,
            maxWidth: 200,
            textAlign: left ? "left" : "center",

            fontSize: 14,
            fontWeight: "semibold",
          }}
        >
          {emoji}
          {content}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
