import { useVision } from "@/context/VisionContext";
import { CameraView } from "expo-camera";
import { Text, Animated } from "react-native";
import { RefObject, useEffect, useRef } from "react";

interface CameraVisionProps {
  camera: RefObject<CameraView>;
}

export default function CameraVision({ camera }: CameraVisionProps) {
  const { feedback, sendMessage } = useVision();

  const animation = new Animated.Value(0);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const animationRef = useRef(animation).current;

  useEffect(() => {
    // Send the first message ASAP
    sendMessage(camera);

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Send a message every second
    intervalRef.current = setInterval(() => {
      sendMessage(camera);
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);

        intervalRef.current = null;
      }
    };
  }, [camera, sendMessage]);

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
