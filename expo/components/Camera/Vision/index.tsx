import { useVision } from "@/context/VisionContext";
import { Text, Animated } from "react-native";
import { useEffect, useRef } from "react";

export default function CameraVision() {
  const { feedback } = useVision();

  const animation = new Animated.Value(0);
  const animationRef = useRef(animation).current;

  useEffect(() => {
    if (feedback) {
      Animated.timing(animationRef, {
        toValue: 0.75,
        duration: 1000,
        useNativeDriver: true,
      }).start();
    }
  }, [feedback, animationRef]);

  return (
    <Animated.View
      style={{
        opacity: animationRef,
        maxWidth: 256,
        alignSelf: "center",
        paddingTop: 16,
      }}
    >
      <Text
        style={{
          color: "#FFF",
          textAlign: "center",
          fontSize: 16,
          fontFamily: "OpenSans_600SemiBold",
        }}
      >
        {feedback}
      </Text>
    </Animated.View>
  );
}
