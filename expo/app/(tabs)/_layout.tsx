import { FontAwesome } from "@expo/vector-icons";
import { Redirect, SplashScreen, Tabs } from "expo-router";
import { useEffect, useState } from "react";
import { AppState } from "react-native";

import NavigationButton from "@/components/Navigation/Button";
import { HealthProvider } from "@/context/HealthContext";
import supabase from "@/utils/supabase";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<null | { user: any }>(null);

  useEffect(() => {
    // Hook for auto-refresh when app state changes
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") {
        supabase.auth.startAutoRefresh();
      } else {
        supabase.auth.stopAutoRefresh();
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    // Hook for keeping the session up to date
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);

      SplashScreen.hideAsync();
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return;
  }

  if (!session || !session.user) {
    return <Redirect href="/sign-in" />;
  }

  return (
    <HealthProvider interval={60000}>
      <Tabs
        screenOptions={({ route }: { route: { name: string } }) => ({
          headerShown: false,
          tabBarActiveTintColor: "blue",
        })}
      >
        <Tabs.Screen
          name="add"
          options={{
            title: "Overview",
            tabBarIcon: ({ color }: { color: string }) => (
              <FontAwesome size={28} name="home" color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="index"
          options={{
            href: null,
            headerShown: false,
          }}
        />

        <Tabs.Screen
          name="redirect"
          options={{
            tabBarButton: (props) => <NavigationButton />,
          }}
        />

        <Tabs.Screen
          name="settings"
          options={{
            title: "Settings",
            tabBarIcon: ({ color }: { color: string }) => (
              <FontAwesome size={28} name="cog" color={color} />
            ),
          }}
        />
      </Tabs>
    </HealthProvider>
  );
}
