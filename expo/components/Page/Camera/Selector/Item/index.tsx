import { Animated, TouchableOpacity } from "react-native";
import { useEffect, useRef } from "react";

type CameraSelectorItemProps = {
  width: number;
  title: string;
  active: boolean;
};

export default function CameraSelectorItem({
  width,
  title,
  active,
}: CameraSelectorItemProps) {
  const activeNumber = active ? 1 : 0;
  const activeAnimation = useRef(new Animated.Value(activeNumber));

  useEffect(() => {
    Animated.timing(activeAnimation.current, {
      toValue: activeNumber,
      duration: 100,
      useNativeDriver: false,
    }).start();
  }, [activeNumber, activeAnimation]);

  const fontSize = activeAnimation.current.interpolate({
    inputRange: [0, 1],
    outputRange: [16, 20],
  });

  const color = activeAnimation.current.interpolate({
    inputRange: [0, 1],
    outputRange: ["#aaa", "#fff"],
  });

  return (
    <TouchableOpacity
      style={{
        width,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Animated.Text
        style={{
          color: color,

          fontSize: fontSize,
          fontFamily: "OpenSans_600SemiBold",

          textAlign: "center",
          paddingVertical: 4,
        }}
      >
        {title}
      </Animated.Text>
    </TouchableOpacity>
  );
}
