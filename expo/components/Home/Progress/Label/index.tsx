import { View, Text } from "react-native";

type HomeProgressLabelProps = {
  value: number;
  label: string;
};

export default function HomeProgressLabel({
  value,
  label,
}: HomeProgressLabelProps) {
  return (
    <View
      style={{
        width: 96,
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <Text style={{ fontSize: 16, fontFamily: "OpenSans_600SemiBold" }}>
        {value}
      </Text>

      <Text style={{ fontSize: 14, fontFamily: "OpenSans_400Regular" }}>
        {label}
      </Text>
    </View>
  );
}
