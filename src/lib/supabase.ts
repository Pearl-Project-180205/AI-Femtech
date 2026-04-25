import { createClient } from "@supabase/supabase-js";

// Ensure these exist in your .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://your-project.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUz...";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
