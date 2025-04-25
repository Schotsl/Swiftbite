import { createClient as createClientSupabase } from "npm:@supabase/supabase-js";

export const supabase = createClientSupabase(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);
