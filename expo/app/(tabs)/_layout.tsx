import { FontAwesome6 } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { HealthProvider } from "@/context/HealthContext";
import { useEffect, useState } from "react";
import { StatusBar, AppState, View } from "react-native";
import { Redirect, SplashScreen, Tabs } from "expo-router";

import supabase from "@/utils/supabase";
import language from "@/language";
import variables from "@/variables";

import useCamera from "@/hooks/useCamera";

import Text from "@/components/Text";
import NavigationAdd from "@/components/Navigation/Add";
import MaskedView from "@react-native-masked-view/masked-view";
import DecorativeLinear from "@/components/Decorative/Linear";
import DecorativeNoise from "@/components/Decorative/Noise";

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
              tabBarShowLabel: false,
              tabBarStyle: {
                height: variables.heightNavigation,
                display: camera ? "none" : "flex",
                paddingTop: 12,
                paddingLeft: 12,
                paddingRight: 12,
                paddingBottom: 8,
                borderTopWidth: variables.border.width,
                borderTopColor: variables.border.color,
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
              tabBarIcon: ({ focused }: { focused: boolean }) => (
                <TabsLayoutIcon
                  icon="book"
                  title={language.navigation.tabs.dairy}
                  focused={focused}
                />
              ),
            }}
          />

          <Tabs.Screen
            name="stats"
            options={{
              tabBarIcon: ({ focused }: { focused: boolean }) => (
                <TabsLayoutIcon
                  icon="chart-line"
                  title={language.navigation.tabs.statistics}
                  focused={focused}
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
              tabBarIcon: ({ focused }: { focused: boolean }) => (
                <TabsLayoutIcon
                  icon="wand-magic-sparkles"
                  title={language.navigation.tabs.automations}
                  focused={focused}
                />
              ),
            }}
          />

          <Tabs.Screen
            name="personal"
            options={{
              tabBarIcon: ({ focused }: { focused: boolean }) => (
                <TabsLayoutIcon
                  icon="circle-user"
                  title={language.navigation.tabs.personal}
                  focused={focused}
                />
              ),
            }}
          />
        </Tabs>
      </HealthProvider>
    </SafeAreaView>
  );
}

type TabsLayoutIconProps = {
  icon: keyof typeof FontAwesome6.glyphMap;
  title: string;
  focused: boolean;
};

function TabsLayoutIcon({ icon, title, focused }: TabsLayoutIconProps) {
  return (
    <MaskedView
      maskElement={
        <View
          style={{
            gap: 4,
            width: 65,
            height: 38,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "transparent",
          }}
        >
          <FontAwesome6 size={18} name={icon} color={variables.colors.black} />

          <Text weight="semibold" size={10} color={variables.colors.black}>
            {title}
          </Text>
        </View>
      }
    >
      {focused ? (
        <View
          style={{
            width: 65,
            height: 38,
            position: "relative",
          }}
        >
          <DecorativeNoise />
          <DecorativeLinear />
        </View>
      ) : (
        <View
          style={{
            width: 65,
            height: 38,
            backgroundColor: variables.border.color,
          }}
        />
      )}
    </MaskedView>
  );
}
