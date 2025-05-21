import { Stack } from "expo-router";

export default function AutomationsLayout() {
  return (
    <Stack
      screenOptions={{
        animation: "none",
        headerShown: false,
        gestureEnabled: true,
        contentStyle: {
          backgroundColor: "#FFFFFF",
        },
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="meal/index" />
      <Stack.Screen name="repeat/index" />
    </Stack>
  );
}
