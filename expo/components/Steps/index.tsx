import variables from "@/variables";
import MaskedView from "@react-native-masked-view/masked-view";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import React, { useEffect } from "react";

import DecorativeLinear from "../Decorative/Linear";
import DecorativeNoise from "../Decorative/Noise";

import { View } from "react-native";
import { useRegister } from "@/context/RegisterContext";

type StepsProps = {
  value: number;
  total: number;
};

export default function Steps({ value, total }: StepsProps) {
  const { previous } = useRegister();

  const fillerStart = value < previous ? value + 1 : value - 1;
  const fillerValue = useSharedValue(fillerStart);

  useEffect(() => {
    fillerValue.value = withTiming(value, { duration: 300 });
  }, [value, fillerValue]);

  const animatedStyle = useAnimatedStyle(() => {
    const fraction = fillerValue.value / total;
    const percentage = fraction * 100;

    return {
      width: `${percentage}%`,
      height: 8,
      borderRadius: 100,
      backgroundColor: variables.colors.primary,
    };
  });

  return (
    <View
      style={{
        width: "100%",
        height: 8,
        borderRadius: 100,
        backgroundColor: variables.colors.grey,
      }}
    >
      <MaskedView maskElement={<Animated.View style={animatedStyle} />}>
        <View style={{ width: "100%", height: "100%" }}>
          <DecorativeLinear />
          <DecorativeNoise />
        </View>
      </MaskedView>
    </View>
  );
}
