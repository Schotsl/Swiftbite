import TextSmall from "@/components/Text/Small";
import variables from "@/variables";

import { View, StyleProp, ViewStyle, TouchableOpacity } from "react-native";

type EmptySmallProps = {
  left?: boolean;
  style?: StyleProp<ViewStyle>;
  content: string;

  onPress: () => void;
};

export default function EmptySmall({
  left = false,
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
        <TextSmall
          weight="medium"
          color={variables.border.color}
          style={{
            maxWidth: 260,
            marginTop: -2,
            textAlign: left ? "left" : "center",
          }}
        >
          {content}
        </TextSmall>
      </View>
    </TouchableOpacity>
  );
}
