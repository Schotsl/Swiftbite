// HAPPY

import variables from "@/variables";
import streakData from "@/queries/streakData";

import TextBody from "@/components/Text/Body";
import DecorativeNoise from "@/components/Decorative/Noise";
import DecorativeLinear from "@/components/Decorative/Linear";

import { Suspense } from "react";
import { FontAwesome6 } from "@expo/vector-icons";
import { ActivityIndicator, View } from "react-native";

import useSuspenseQueryFocus from "@/hooks/useSuspenseQueryFocus";

export default function HomeStreak() {
  const { data } = useSuspenseQueryFocus(streakData());

  return (
    <View
      style={{
        gap: variables.gap.small,
        alignItems: "center",
        flexDirection: "row",

        paddingVertical: variables.padding.small.vertical,
        paddingHorizontal: variables.padding.small.horizontal,

        overflow: "hidden",
        borderRadius: 100,
      }}
    >
      <DecorativeLinear />
      <DecorativeNoise />

      <FontAwesome6 name="fire" size={16} color="#ffffff" />

      <View
        style={{
          height: 22,
          minWidth: 16,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Suspense fallback={<HomeStreakLoading />}>
          <TextBody weight="bold" style={{ color: variables.colors.white }}>
            {data}
          </TextBody>
        </Suspense>
      </View>
    </View>
  );
}

function HomeStreakLoading() {
  return (
    <ActivityIndicator
      size="small"
      color="#FFFFFF"
      style={{ transform: [variables.scale], position: "absolute" }}
    />
  );
}
