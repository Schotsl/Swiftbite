import { FontAwesome6 } from "@expo/vector-icons";
import { Redirect, SplashScreen, Tabs } from "expo-router";
import { useEffect, useState } from "react";
import { AppState } from "react-native";

import NavigationAdd from "@/components/Navigation/Add";
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
          tabBarActiveTintColor: "#000",
          tabBarStyle: {
            paddingTop: 10,
            paddingBottom: 10,
            paddingLeft: 12,
            paddingRight: 12,
            borderTopWidth: 2,
            borderTopColor: "#000",
          },
        })}
      >
        <Tabs.Screen
          name="index"
          options={{
            href: null,
            headerShown: false,
          }}
        />

        <Tabs.Screen
          name="add"
          options={{
            title: "Overview",
            tabBarIcon: ({ color }: { color: string }) => (
              <FontAwesome6
                size={18}
                name="book"
                color={color}
                style={{ marginBottom: 4 }}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="stats"
          options={{
            title: "Stats",
            tabBarIcon: ({ color }: { color: string }) => (
              <FontAwesome6
                size={18}
                name="chart-line"
                color={color}
                style={{ marginBottom: 4 }}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="redirect"
          options={{
            tabBarButton: (props) => <NavigationAdd />,
          }}
        />

        <Tabs.Screen
          name="automations"
          options={{
            title: "Automations",
            tabBarIcon: ({ color }: { color: string }) => (
              <FontAwesome6
                size={18}
                name="wand-magic-sparkles"
                color={color}
                style={{ marginBottom: 4 }}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="personal"
          options={{
            title: "Personal",
            tabBarIcon: ({ color }: { color: string }) => (
              <FontAwesome6
                size={18}
                name="circle-user"
                color={color}
                style={{ marginBottom: 4 }}
              />
            ),
          }}
        />
      </Tabs>
    </HealthProvider>
  );
}
