import { createClient } from "@supabase/supabase-js";

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || "").trim();
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || "").trim();

if (!supabaseUrl.startsWith("http")) {
  throw new Error(
    "VITE_SUPABASE_URL must start with https:// — check your my-app/.env file"
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
