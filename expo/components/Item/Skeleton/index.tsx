// HAPPY

import variables from "@/variables";

import { View } from "react-native";

import Skeleton from "react-native-reanimated-skeleton";

type SkeletonItemProps = {
  icon?: boolean;
  small?: boolean;
  border?: boolean;
};

export default function ItemSkeleton({
  icon = false,
  small = false,
  border = true,
}: SkeletonItemProps) {
  const gap = 16;
  const padding = small ? 20 : variables.padding.page;

  // Random width variations (±10%)
  const titleWidth = 100 + Math.random() * 20;
  const subtitleWidth = 75 + Math.random() * 15;
  const rightTopWidth = 50 + Math.random() * 20;
  const rightBottomWidth = 25 + Math.random() * 15;

  return (
    <View
      style={{
        height: 75,
        minWidth: "100%",
        borderBottomWidth: border ? variables.border.width : 0,
        borderBottomColor: variables.border.color,

        flexDirection: "column",
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
          containerStyle={{ gap: 8 }}
          layout={[
            { key: "title", width: titleWidth, height: 20, top: 1 },
            { key: "subtitle", width: subtitleWidth, height: 16, bottom: 2 },
          ]}
        />

        <Skeleton
          isLoading={true}
          containerStyle={{ gap: 8 }}
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
