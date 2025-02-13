import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack options={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
