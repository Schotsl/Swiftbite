import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Slot, Stack, usePathname, useRouter } from "expo-router";
import { View } from "react-native";
import {
  Directions,
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import { runOnJS } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

export default function RootLayout() {
  const router = useRouter();
  const pathname = usePathname();

  const query = new QueryClient();

  const handleBack = () => {
    if (!router.canGoBack()) {
      return;
    }

    router.back();
  };

  // Define the gesture and handle the back action
  const handleGesture = Gesture.Fling()
    .direction(Directions.RIGHT)
    .onEnd(() => runOnJS(handleBack)());

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["right", "left", "top"]}>
      <QueryClientProvider client={query}>
        <GestureHandlerRootView>
          <GestureDetector gesture={handleGesture}>
            <Stack
              screenOptions={{
                headerShown: false,
                gestureEnabled: true,
              }}
            >
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="sign-in" />
              <Stack.Screen name="sign-up" />
            </Stack>
          </GestureDetector>
        </GestureHandlerRootView>
      </QueryClientProvider>
    </SafeAreaView>
  );
}
