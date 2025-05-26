// HAPPY

import variables from "@/variables";

import { View } from "react-native";

import Skeleton from "react-native-reanimated-skeleton";

type SkeletonItemProps = {
  uuid?: string;
  icon?: boolean;
  small?: boolean;
  border?: boolean;
};

export default function ItemSkeleton({
  uuid,
  icon = false,
  small = false,
  border = true,
}: SkeletonItemProps) {
  const gap = 16;
  const padding = small ? 20 : variables.padding.page;

  // I generated this function using Gemini and I do understand it except the hashing loop
  const getRandom = (index: number) => {
    if (!uuid) {
      return Math.random();
    }

    let hash = 0;

    const seed = uuid + index;

    for (let i = 0; i < seed.length; i++) {
      const char = seed.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }

    // Divide by 32-bit signed integer since the has should return that at most
    const sumAbsolute = Math.abs(hash);
    const sumDivided = sumAbsolute / 2147483647;

    return sumDivided;
  };

  // Random width variations (±10%)
  const titleWidth = 100 + getRandom(0) * 20;
  const subtitleWidth = 75 + getRandom(1) * 15;
  const rightTopWidth = 50 + getRandom(2) * 20;
  const rightBottomWidth = 25 + getRandom(3) * 15;

  return (
    <View
      style={{
        height: 75,
        minWidth: "100%",
        borderBottomWidth: border ? variables.border.width : 0,
        borderBottomColor: variables.border.color,

        flexDirection: "column",
        backgroundColor: variables.colors.white,
        paddingVertical: variables.padding.small.horizontal,
        paddingHorizontal: padding,
      }}
    >
      <View
        style={{
          gap,
          height: "100%",
          minWidth: "100%",
          alignItems: "center",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        {icon && (
          <Skeleton
            isLoading={true}
            containerStyle={{ width: 42, height: 42 }}
            layout={[{ key: "icon", width: 42, height: 42 }]}
          />
        )}

        <Skeleton
          isLoading={true}
          containerStyle={{ gap: variables.gap.small }}
          layout={[
            { key: "title", width: titleWidth, height: 20, top: 1 },
            { key: "subtitle", width: subtitleWidth, height: 16, bottom: 2 },
          ]}
        />

        <Skeleton
          isLoading={true}
          containerStyle={{ gap: variables.gap.small }}
          layout={[
            { key: "rightTop", width: rightTopWidth, height: 20, top: 1 },
            {
              key: "rightBottom",
              width: rightBottomWidth,
              height: 16,
              bottom: 2,
              alignSelf: "flex-end",
            },
          ]}
        />
      </View>
    </View>
  );
}
