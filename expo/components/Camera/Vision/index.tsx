import { useVision } from "@/context/VisionContext";
import { Text, Animated } from "react-native";
import { useEffect, useRef } from "react";

export default function CameraVision() {
  const { feedback, feedbackOld, resetHistory, resetFeedback } = useVision();

  const animation = new Animated.Value(0);
  const animationRef = useRef(animation).current;

  useEffect(() => {
    if (feedback) {
      if (feedback !== "OK") {
        Animated.timing(animationRef, {
          toValue: 0.85,
          duration: 1000,
          useNativeDriver: true,
        }).start();

        return;
      }

      Animated.timing(animationRef, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }).start();
    }
  }, [feedback, animationRef]);

  useEffect(() => {
    return () => {
      resetHistory();
      resetFeedback();
    };
  }, []);

  return (
    <Animated.View
      style={{
        top: 68,
        left: "50%",
        width: 200,
        opacity: animationRef,
        maxWidth: 200,
        alignSelf: "center",
        position: "absolute",
        transform: [{ translateX: -100 }],
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
        {feedback === "OK" ? feedbackOld : feedback}
      </Text>
    </Animated.View>
  );
}
