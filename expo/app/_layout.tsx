import { Session } from "@supabase/supabase-js";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { AppState } from "react-native";

import { HealthProvider } from "@/context/HealthContext";

import Auth from "../components/Auth";
import supabase from "../utils/supabase";

export default function RootLayout() {
  const [session, setSession] = useState<Session | null>(null);

  const queryClient = new QueryClient();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  AppState.addEventListener("change", (state) => {
    if (state === "active") {
      supabase.auth.startAutoRefresh();
    } else {
      supabase.auth.stopAutoRefresh();
    }
  });

  return (
    <QueryClientProvider client={queryClient}>
      {session && session.user ? (
        <HealthProvider interval={60000}>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          </Stack>
        </HealthProvider>
      ) : (
        <Auth />
      )}
    </QueryClientProvider>
  );
}
