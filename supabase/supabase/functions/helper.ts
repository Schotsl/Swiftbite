import { PostgrestError } from "npm:@supabase/supabase-js";
import { AuthError } from "npm:@supabase/supabase-js";

export const handleError = (error: AuthError | PostgrestError | null) => {
  if (error) {
    console.log(error);

    throw new Error(error.message);
  }
};
