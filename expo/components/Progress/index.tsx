import { Text, View } from "react-native";

type ProgressProps = {
  label: string;
  value: number;
  target: number;
};

export default function Progress({ label, value, target }: ProgressProps) {
  const progress = (value / target) * 100;

  return (
    <View style={{ gap: 8, width: 96, alignItems: "center" }}>
      <Text style={{ fontSize: 16, fontFamily: "OpenSans_600SemiBold" }}>
        {label}
      </Text>
      <View
        style={{
          width: "100%",
          height: 10,
          position: "relative",

          borderWidth: 2,
          borderRadius: 8,
          borderColor: "#000",
        }}
      >
        <View
          style={{
            top: -2,
            left: -2,
            width: progress,
            height: 10,
            position: "absolute",

            borderRadius: 8,
            backgroundColor: "#000",
          }}
        />
      </View>

      <View style={{ flexDirection: "row", gap: 4 }}>
        <Text style={{ fontSize: 14, fontFamily: "OpenSans_400Regular" }}>
          {value}g
        </Text>
        <Text style={{ fontSize: 14, fontFamily: "OpenSans_600SemiBold" }}>
          /
        </Text>
        <Text style={{ fontSize: 14, fontFamily: "OpenSans_600SemiBold" }}>
          {target}g
        </Text>
      </View>
    </View>
  );
}
