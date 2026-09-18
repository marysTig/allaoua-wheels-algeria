import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "placeholder";

if (supabaseUrl === "https://placeholder.supabase.co" || supabaseAnonKey === "placeholder") {
  console.warn("Supabase credentials missing in .env. Falling back to placeholder (operations will fail).");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
