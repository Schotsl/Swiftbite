import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://pkjlpsgjalwehbayowib.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBramxwc2dqYWx3ZWhiYXlvd2liIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk5Nzc4NDQsImV4cCI6MjA1NTU1Mzg0NH0.KMLxZj5c34M-JE6IM4f64EtkKfFYfw_Fp_23hnRHLTg";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
