import streakData from "@/queries/streakData";

import { FontAwesome6 } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { View, Text, ActivityIndicator } from "react-native";

type HomeStreakProps = {
  focus: boolean;
};

export default function HomeStreak({ focus }: HomeStreakProps) {
  const { data, isLoading } = useQuery({
    ...streakData(),
    enabled: focus,
  });

  return (
    <View
      style={{
        gap: 8,
        alignItems: "center",
        flexDirection: "row",

        paddingHorizontal: 16,
        paddingVertical: 8,

        borderWidth: 2,
        borderColor: "#000000",
        borderRadius: 100,
      }}
    >
      <FontAwesome6 name="fire" size={16} color="#000000" />
      <View
        style={{
          height: 22,
          minWidth: 20,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {isLoading ? (
          <ActivityIndicator
            size="small"
            color="#000000"
            style={{ transform: [{ scale: 0.85 }] }}
          />
        ) : (
          <Text style={{ fontSize: 16, fontFamily: "OpenSans_600SemiBold" }}>
            {data}
          </Text>
        )}
      </View>
    </View>
  );
}
