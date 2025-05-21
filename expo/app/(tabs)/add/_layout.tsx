import { Stack } from "expo-router";

export default function AddLayout() {
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
      <Stack.Screen name="camera" />
      <Stack.Screen name="estimation" />
      <Stack.Screen name="meal" />
      <Stack.Screen name="product" />
      <Stack.Screen name="search" />
    </Stack>
  );
}
