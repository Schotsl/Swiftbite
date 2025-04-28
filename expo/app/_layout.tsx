import { runOnJS } from "react-native-reanimated";
import { useEffect, useState } from "react";
import { VisionProvider } from "@/context/VisionContext";
import { isRunningInExpoGo } from "expo";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack, useNavigationContainerRef, useRouter } from "expo-router";
import {
  Directions,
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";

import * as Sentry from "@sentry/react-native";

import { useFonts } from "@expo-google-fonts/open-sans/useFonts";
import { OpenSans_300Light } from "@expo-google-fonts/open-sans/300Light";
import { OpenSans_400Regular } from "@expo-google-fonts/open-sans/400Regular";
import { OpenSans_500Medium } from "@expo-google-fonts/open-sans/500Medium";
import { OpenSans_600SemiBold } from "@expo-google-fonts/open-sans/600SemiBold";
import { OpenSans_700Bold } from "@expo-google-fonts/open-sans/700Bold";
import { OpenSans_800ExtraBold } from "@expo-google-fonts/open-sans/800ExtraBold";
import { OpenSans_300Light_Italic } from "@expo-google-fonts/open-sans/300Light_Italic";
import { OpenSans_400Regular_Italic } from "@expo-google-fonts/open-sans/400Regular_Italic";
import { OpenSans_500Medium_Italic } from "@expo-google-fonts/open-sans/500Medium_Italic";
import { OpenSans_600SemiBold_Italic } from "@expo-google-fonts/open-sans/600SemiBold_Italic";
import { OpenSans_700Bold_Italic } from "@expo-google-fonts/open-sans/700Bold_Italic";
import { OpenSans_800ExtraBold_Italic } from "@expo-google-fonts/open-sans/800ExtraBold_Italic";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

const sentryIntegration = Sentry.reactNavigationIntegration({
  enableTimeToInitialDisplay: !isRunningInExpoGo(),
});

Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
  debug: false,
  enabled: !isRunningInExpoGo(),
  integrations: [sentryIntegration],
});

function RootLayout() {
  const query = new QueryClient();

  const router = useRouter();
  const container = useNavigationContainerRef();

  const [configured, setConfigured] = useState(false);

  useEffect(() => {
    if (!container?.current) {
      return;
    }

    // I added this to prevent annoying logs about re-initializing the integration
    if (configured) {
      return;
    }

    // Register the navigation integration
    sentryIntegration.registerNavigationContainer(container);

    setConfigured(true);
  }, [container, configured]);

  useFonts({
    OpenSans_300Light,
    OpenSans_400Regular,
    OpenSans_500Medium,
    OpenSans_600SemiBold,
    OpenSans_700Bold,
    OpenSans_800ExtraBold,
    OpenSans_300Light_Italic,
    OpenSans_400Regular_Italic,
    OpenSans_500Medium_Italic,
    OpenSans_600SemiBold_Italic,
    OpenSans_700Bold_Italic,
    OpenSans_800ExtraBold_Italic,
  });

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
    // TODO: This should be able to moved a level lower
    <VisionProvider>
      <QueryClientProvider client={query}>
        <GestureHandlerRootView>
          <GestureDetector gesture={handleGesture}>
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
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="camera" />
              <Stack.Screen name="sign-in" />
              <Stack.Screen name="sign-up" />
            </Stack>
          </GestureDetector>
        </GestureHandlerRootView>
      </QueryClientProvider>
    </VisionProvider>
  );
}

export default Sentry.wrap(RootLayout);
