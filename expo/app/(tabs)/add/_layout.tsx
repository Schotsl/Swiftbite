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

      <Stack.Screen name="estimation/index" />
      <Stack.Screen name="meal/index" />
      <Stack.Screen name="product/index" />
      <Stack.Screen name="search/index" />
    </Stack>
  );
}
