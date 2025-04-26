import { View, Text, TouchableOpacity } from "react-native";

type HomeWeekDayProps = {
  type: "normal" | "thick" | "dashed";
  date: number;
  weekday: string;
  onPress: () => void;
};

export default function HomeWeekDay({
  type,
  date,
  weekday,
  onPress,
}: HomeWeekDayProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
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
    </TouchableOpacity>
  );
}
