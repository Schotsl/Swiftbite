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
      <Stack.Screen name="delete" />
      <Stack.Screen name="details" />
      <Stack.Screen name="export" />
      <Stack.Screen name="goals" />
      <Stack.Screen name="health" />
      <Stack.Screen name="password" />
      <Stack.Screen name="preferences" />
    </Stack>
  );
}
