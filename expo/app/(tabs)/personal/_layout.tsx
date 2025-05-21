import { Stack } from "expo-router";

export default function PersonalLayout() {
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
      <Stack.Screen name="delete/index" />
      <Stack.Screen name="details/index" />
      <Stack.Screen name="export/index" />
      <Stack.Screen name="goals/index" />
      <Stack.Screen name="health/index" />
      <Stack.Screen name="password/index" />
      <Stack.Screen name="preferences/index" />
    </Stack>
  );
}
