import { View, Text } from "react-native";

type HomeMacrosProgressLabelProps = {
  value: number;
  label: string;
};

export default function HomeMacrosProgressLabel({
  value,
  label,
}: HomeMacrosProgressLabelProps) {
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
