import { AppState } from "react-native";
import { StatusBar } from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { HealthProvider } from "@/context/HealthContext";
import { useEffect, useState } from "react";
import { Redirect, SplashScreen, Tabs } from "expo-router";

import supabase from "@/utils/supabase";
import variables from "@/variables";

import useCamera from "@/hooks/useCamera";
import NavigationAdd from "@/components/Navigation/Add";
import language from "@/language";

SplashScreen.preventAutoHideAsync();

export default function TabsLayout() {
  const camera = useCamera();

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

  useEffect(() => {
    if (camera) {
      StatusBar.setBarStyle("light-content");
    } else {
      StatusBar.setBarStyle("dark-content");
    }
  }, [camera]);

  if (loading) {
    return;
  }

  if (!session || !session.user) {
    return <Redirect href="/sign-in" />;
  }

  return (
    <SafeAreaView
      style={{ flex: 1 }}
      edges={camera ? ["right", "left"] : ["right", "left", "top"]}
    >
      <HealthProvider interval={60000}>
        <Tabs
          screenOptions={() => {
            return {
              headerShown: false,
              tabBarActiveTintColor: variables.colors.primary,
              tabBarStyle: {
                display: camera ? "none" : "flex",
                paddingTop: 10,
                paddingLeft: 12,
                paddingRight: 12,
                paddingBottom: 10,
                borderTopWidth: 2,
                borderTopColor: variables.colors.grey,
              },
            };
          }}
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
              title: language.navigation.tabs.dairy,
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
              title: language.navigation.tabs.statistics,
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
              tabBarButton: () => <NavigationAdd />,
            }}
          />

          <Tabs.Screen
            name="automations"
            options={{
              title: language.navigation.tabs.automations,
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
              title: language.navigation.tabs.personal,
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
    </SafeAreaView>
  );
}
