import { useVision } from "@/context/VisionContext";
import { Animated } from "react-native";
import { useEffect, useRef } from "react";

import TextBody from "@/components/Text/Body";

import variables from "@/variables";

export default function CameraVision() {
  const { feedback, feedbackOld, resetHistory, resetFeedback } = useVision();

  const animation = new Animated.Value(0);
  const animationRef = useRef(animation).current;

  // I've asked Gemini to create the fade in and out animation
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
    // TODO: Check with David if this is needed
  }, []);

  return (
    <Animated.View
      style={{
        left: "50%",
        width: 200,
        bottom: 288,
        opacity: animationRef,
        maxWidth: 200,
        alignSelf: "center",
        position: "absolute",
        transform: [{ translateX: -100 }],
      }}
    >
      <TextBody color={variables.colors.white} align="center" weight="semibold">
        {feedback === "OK" ? feedbackOld : feedback}
      </TextBody>
    </Animated.View>
  );
}
