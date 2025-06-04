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
  return (
    <View
      style={{
        shadowColor: "#000",
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.025,

        // I added this background color to improve shadow performance
        borderRadius: 100,
        backgroundColor: variables.colors.white,
      }}
    >
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
            <HomeStreakContent />
          </Suspense>
        </View>
      </View>
    </View>
  );
}

function HomeStreakContent() {
  const { data } = useSuspenseQueryFocus(streakData());

  return (
    <TextBody weight="bold" style={{ color: variables.colors.white }}>
      {data}
    </TextBody>
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
