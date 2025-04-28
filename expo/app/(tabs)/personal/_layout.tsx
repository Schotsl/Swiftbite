import { Stack } from "expo-router";

export default function RootLayout() {
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

      <Stack.Screen name="my-details" />
      <Stack.Screen name="my-health" />
      <Stack.Screen name="my-preferences" />

      <Stack.Screen name="change-goals" />
      <Stack.Screen name="change-password" />

      <Stack.Screen name="export-data" />

      <Stack.Screen name="delete-account" />
    </Stack>
  );
}
