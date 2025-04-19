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
      <Stack.Screen name="add-ai" />
      <Stack.Screen name="add-barcode" />
      <Stack.Screen name="add-preview-barcode" />
      <Stack.Screen name="add-preview" />
      <Stack.Screen name="add-text" />
    </Stack>
  );
}
