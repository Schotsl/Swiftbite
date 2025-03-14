import { Session } from "@supabase/supabase-js";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { useEffect, useState } from "react";

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

  return session && session.user ? (
    <QueryClientProvider client={queryClient}>
      <HealthProvider interval={60000}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </HealthProvider>
    </QueryClientProvider>
  ) : (
    <Auth />
  );
}
