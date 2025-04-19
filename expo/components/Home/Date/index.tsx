import { View, Text } from "react-native";

type HomeDateProps = {
  type: "normal" | "thick" | "dashed";
  date: number;
  weekday: string;
};

export default function HomeDate({ type, date, weekday }: HomeDateProps) {
  return (
    <View
      style={{
        gap: 8,
        alignItems: "center",
      }}
    >
      <View
        style={{
          width: 36,
          height: 36,

          borderColor: "#000",
          borderWidth: type === "thick" ? 3 : 2,
          borderStyle: type === "dashed" ? "dashed" : "solid",
          borderRadius: 100,

          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ fontSize: 16, fontFamily: "OpenSans_700Bold" }}>
          {weekday}
        </Text>
      </View>

      <Text style={{ fontSize: 16, fontFamily: "OpenSans_700Bold" }}>
        {date}
      </Text>
    </View>
  );
}
