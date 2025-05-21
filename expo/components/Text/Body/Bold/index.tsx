import { Text } from "react-native";

export default function TextBodyBold({
  children,
}: {
  children: string | number;
}) {
  return (
    <Text style={{ fontSize: 16, fontFamily: "OpenSans_700Bold" }}>
      {children}
    </Text>
  );
}
