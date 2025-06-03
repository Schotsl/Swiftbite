import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignInLayout() {
  return (
    <SafeAreaView style={{ flex: 1 }} edges={["right", "left", "top"]}>
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
        <Stack.Screen name="password-success" />
        <Stack.Screen name="password-forgotten" />
      </Stack>
    </SafeAreaView>
  );
}
