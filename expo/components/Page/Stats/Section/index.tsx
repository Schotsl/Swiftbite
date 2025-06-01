import React, { useEffect, ReactNode, useRef } from "react";
import { TouchableOpacity, Animated, View } from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";

import TextSubtitle from "@/components/Text/Subtitle";

import variables from "@/variables";

type PageStatsSectionProps = {
  last?: boolean;
  open: boolean;
  title: string;
  children: ReactNode;
  onToggle: () => void;
};

export default function PageStatsSection({
  last = false,
  open,
  title,
  children,
  onToggle,
}: PageStatsSectionProps) {
  const animation = new Animated.Value(open ? 0 : 1);
  const animationRef = useRef(animation).current;

  useEffect(() => {
    Animated.timing(animationRef, {
      toValue: open ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [open, animationRef]);

  const arrowRotation = animationRef.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  return (
    <View
      style={{
        gap: variables.gap.normal,
        paddingBottom: last ? 0 : 24,
        borderBottomWidth: last ? 0 : variables.border.width,
        borderBottomColor: last ? "transparent" : variables.border.color,
      }}
    >
      <TouchableOpacity
        onPress={onToggle}
        style={{
          gap: variables.gap.small,

          alignItems: "center",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <TextSubtitle weight="semibold">{title}</TextSubtitle>
        <Animated.View style={{ transform: [{ rotate: arrowRotation }] }}>
          <FontAwesome6
            name="chevron-down"
            size={16}
            color={variables.colors.text.primary}
          />
        </Animated.View>
      </TouchableOpacity>

      {open && <View style={{ gap: variables.gap.normal }}>{children}</View>}
    </View>
  );
}
