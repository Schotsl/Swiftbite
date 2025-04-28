import { DimensionValue, StyleProp, Text, View, ViewStyle } from "react-native";

type ProgressProps = {
  type?: string;
  label: string;
  value: number;
  style?: StyleProp<ViewStyle>;
  target: number;
};

export default function Progress({
  type = "g",
  label,
  value,
  style,
  target,
}: ProgressProps) {
  const progress = (value / target) * 100;
  const progressRounded = Math.round(progress);
  const progressWidth = `${progressRounded}%` as DimensionValue;

  return (
    <View style={[{ gap: 8, flex: 1, alignItems: "center" }, style]}>
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
            width: progressWidth,
            height: 6,
            maxWidth: "100%",
            position: "absolute",

            borderRadius: 8,
            backgroundColor: "#000",
          }}
        />
      </View>

      <View style={{ flexDirection: "row", gap: 4 }}>
        <Text style={{ fontSize: 14, fontFamily: "OpenSans_400Regular" }}>
          {value}
          {type}
        </Text>
        <Text style={{ fontSize: 14, fontFamily: "OpenSans_600SemiBold" }}>
          /
        </Text>
        <Text style={{ fontSize: 14, fontFamily: "OpenSans_600SemiBold" }}>
          {target}
          {type}
        </Text>
      </View>
    </View>
  );
}
