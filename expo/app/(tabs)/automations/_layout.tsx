import { Link, Stack } from "expo-router";
import { Text } from "react-native";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        gestureEnabled: true,
        headerRight: () => (
          <Link href="/automations/meal/insert">
            <Text>Add</Text>
          </Link>
        ),
      }}
    >
      <Stack.Screen name="index" />
    </Stack>
  );
}
