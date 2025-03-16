import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";

import NavigationButton from "@/components/Navigation/Button";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={({ route }: { route: { name: string } }) => ({
        tabBarActiveTintColor: "blue",
        tabBarStyle: {
          display: route.name.startsWith("add") ? "none" : "flex",
        },
      })}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }: { color: string }) => (
            <FontAwesome size={28} name="home" color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="add/add"
        options={{
          title: "Add",
          headerShown: false,
          tabBarButton: NavigationButton,
        }}
      />

      <Tabs.Screen
        name="add/add-ai"
        options={{
          href: null,
          headerShown: false,
        }}
      />

      <Tabs.Screen
        name="add/add-barcode"
        options={{
          href: null,
          headerShown: false,
        }}
      />

      <Tabs.Screen
        name="add/add-preview"
        options={{
          href: null,
          headerShown: false,
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
  );
}
