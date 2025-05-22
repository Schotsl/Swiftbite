// HAPPY

import {
  withTiming,
  useSharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";

import { useEffect } from "react";
import { FontAwesome6 } from "@expo/vector-icons";
import { TouchableOpacity, View } from "react-native";

import Animated from "react-native-reanimated";
import variables from "@/variables";
import MaskedView from "@react-native-masked-view/masked-view";
import DecorativeNoise from "@/components/Decorative/Noise";
import DecorativeLinear from "@/components/Decorative/Linear";

type NavigationAddInnerProps = {
  open: boolean;
  overlay: boolean;

  onPress: () => void;
};

export default function NavigationAddInner({
  open,
  overlay,
  onPress,
}: NavigationAddInnerProps) {
  const animatedRotation = useSharedValue(0);
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${animatedRotation.value}deg` }],
    };
  });

  const AnimatedIcon =
    Animated.createAnimatedComponent<typeof FontAwesome6>(FontAwesome6);

  useEffect(() => {
    const value = open ? 45 : 0;
    const timing = { duration: 200 };

    animatedRotation.value = withTiming(value, timing);
  }, [open, animatedRotation]);

  return (
    <View>
      {overlay && (
        <MaskedView
          style={{
            top: -2,
            left: -2,
            width: 66,
            height: 66,
            position: "absolute",
          }}
          maskElement={
            <View
              style={{
                top: 12,
                width: 66,
                height: 54,
                backgroundColor: variables.colors.black,
              }}
            ></View>
          }
        >
          <View
            style={{
              width: 66,
              height: 66,
              borderRadius: 66,
              backgroundColor: variables.colors.grey,
            }}
          ></View>
        </MaskedView>
      )}

      <TouchableOpacity
        activeOpacity={1}
        onPress={onPress}
        style={{
          width: 62,
          height: 62,
          zIndex: 11,
          overflow: "hidden",
          alignItems: "center",
          borderRadius: 62,
          justifyContent: "center",
        }}
      >
        <DecorativeLinear />
        <DecorativeNoise />

        <AnimatedIcon
          size={24}
          name="plus"
          color={variables.colors.white}
          style={animatedStyle}
        />
      </TouchableOpacity>
    </View>
  );
}
