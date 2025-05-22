import { StyleProp, Text, TextStyle } from "react-native";

export default function TextBodyBold({
  style,
  children,
}: {
  style?: StyleProp<TextStyle>;
  children: string | number;
}) {
  return (
    <Text style={[{ fontSize: 16, fontFamily: "OpenSans_700Bold" }, style]}>
      {children}
    </Text>
  );
}
