import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_ANON_KEY, BACKEND_READY } from "./config";

// When the backend isn't configured yet we still create a client with harmless
// placeholder values so imports don't crash; guarded calls check BACKEND_READY first.
export const supabase: SupabaseClient = createClient(
  SUPABASE_URL || "https://placeholder.supabase.co",
  SUPABASE_ANON_KEY || "public-anon-placeholder",
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  }
);

export { BACKEND_READY };
