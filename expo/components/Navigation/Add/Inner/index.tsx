import {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

import { useEffect } from "react";
import { FontAwesome6 } from "@expo/vector-icons";
import { TouchableOpacity, View } from "react-native";

import Animated from "react-native-reanimated";

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
    <View
      style={{
        borderWidth: 2,
        borderColor: overlay ? "#000" : "transparent",
        borderRadius: 100,
      }}
    >
      {overlay && (
        <View
          style={{
            top: -2,
            width: 70,
            height: 14,
            position: "absolute",
            backgroundColor: "#fff",
          }}
        ></View>
      )}

      <View
        style={{
          borderWidth: 4,
          borderColor: overlay ? "#fff" : "transparent",
          borderRadius: 100,
        }}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={onPress}
          style={{
            width: 62,
            height: 62,
            zIndex: 11,

            borderWidth: 2,
            borderColor: "#000",
            borderRadius: 100,

            backgroundColor: "#fff",

            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <AnimatedIcon
            size={18}
            name="plus"
            color="#000"
            style={animatedStyle}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}
