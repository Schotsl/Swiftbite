import { Stack } from "expo-router";

export default function StatsLayout() {
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
    </Stack>
  );
}
