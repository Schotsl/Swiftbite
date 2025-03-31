import { handleError } from "../helper";
import { createClient as createClientSupabase } from "@supabase/supabase-js";

export const supabase = createClientSupabase(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!,
);

export async function getUser(request: Request) {
  const header = request.headers.get("Authorization");

  if (!header) {
    return;
  }

  const token = header.replace("Bearer ", "");

  const { error, data } = await supabase.auth.getUser(token);

  handleError(error);

  const uuid = data.user?.id;
  return uuid;
}
