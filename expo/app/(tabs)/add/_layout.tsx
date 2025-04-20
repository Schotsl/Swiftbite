import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        contentStyle: {
          backgroundColor: "#FFFFFF",
        },
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="add-text" />
      <Stack.Screen name="add-camera" />
      <Stack.Screen name="add-product" />
      <Stack.Screen name="add-estimation" />
    </Stack>
  );
}
