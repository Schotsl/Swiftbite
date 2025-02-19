import { Stack } from "expo-router";
import { FoodProvider } from "@/context/FoodContext";

export default function RootLayout() {
  return (
    <FoodProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </FoodProvider>
  );
}
