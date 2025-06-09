import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { RegisterProvider } from "@/context/RegisterContext";
import { HealthProvider } from "@/context/HealthContext";

export default function SignInLayout() {
  return (
    <SafeAreaView style={{ flex: 1 }} edges={["right", "left", "top"]}>
      <RegisterProvider>
        <HealthProvider interval={null}>
          <Stack
            screenOptions={{
              animation: "none",
              headerShown: false,
              gestureEnabled: true,
              contentStyle: {
                backgroundColor: "#ffffff",
              },
            }}
          >
            <Stack.Screen name="index" />
            <Stack.Screen name="step-1/index" />
            <Stack.Screen name="step-2/index" />
            <Stack.Screen name="step-3/index" />
            <Stack.Screen name="step-4/index" />
            <Stack.Screen name="step-5/index" />
            <Stack.Screen name="step-6/index" />
            <Stack.Screen name="step-7/index" />
            <Stack.Screen name="step-8/index" />
          </Stack>
        </HealthProvider>
      </RegisterProvider>
    </SafeAreaView>
  );
}
