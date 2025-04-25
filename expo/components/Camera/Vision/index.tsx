import supabase from "@/utils/supabase";

import { CameraView } from "expo-camera";
import { captureRef } from "react-native-view-shot";
import { renderToBase64 } from "@/helper";
import { Text, Animated } from "react-native";
import { ImageManipulator } from "expo-image-manipulator";
import { RefObject, useEffect, useRef, useState } from "react";

interface CameraVisionProps {
  camera: RefObject<CameraView>;
}

export default function CameraVision({ camera }: CameraVisionProps) {
  const abort = useRef<AbortController | null>(null);

  const animation = new Animated.Value(0);
  const animationRef = useRef(animation);

  const [feedback, setFeedback] = useState<string | null>(
    "No food or product detected"
  );

  const getVision = async (base64: string, signal: AbortSignal) => {
    const session = await supabase.auth.getSession();
    const bearer = session?.data.session?.access_token;
    const headers = {
      Authorization: `Bearer ${bearer}`,
      "Content-Type": "application/json",
    };

    const url = `${process.env.EXPO_PUBLIC_SWIFTBITE_URL}/api/ai/vision`;
    const body = JSON.stringify({ base64 });
    const method = "POST";
    const response = await fetch(url, { headers, method, body, signal });
    const results = await response.json();

    return results.feedback;
  };

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    Animated.timing(animationRef.current, {
      toValue: 0.75,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    intervalId = setInterval(async () => {
      if (!camera.current) {
        return;
      }

      // Abort previous request if it's still running
      if (abort.current) {
        abort.current.abort();
      }

      // Create a new AbortController for the new request
      const controller = new AbortController();

      abort.current = controller;

      const result = await captureRef(camera.current, {
        height: 256,
        quality: 0.1,
      });

      const manipulator = ImageManipulator.manipulate(result);

      const base64 = await renderToBase64(manipulator, true);
      const feedback = await getVision(base64, controller.signal);

      setFeedback(feedback);

      abort.current = null;
    }, 1500);

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }

      if (abort.current) {
        abort.current.abort();
        abort.current = null;
      }
    };
  }, [camera]);

  return (
    <Animated.View
      style={{
        opacity: animation,
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
