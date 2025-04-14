import { Text } from "react-native";

export default function Label({ label }: { label: string }) {
  return (
    <Text
      style={{
        color: "#000",
        fontSize: 14,
        fontWeight: "semibold",
        marginBottom: 8,
      }}
    >
      {label}
    </Text>
  );
}
