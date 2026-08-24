import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://melvkemjdoluueaunvkn.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1lbHZrZW1qZG9sdXVlYXVudmtuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA4MjQxNDMsImV4cCI6MjA4NjQwMDE0M30.gMyLnPgP4vu1ZyrtpF4Ab29QNiGbuGfSc6U-hU836xI";

export const supabaseStorageBucket = "portfolio-images";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    detectSessionInUrl: true,
    persistSession: true,
  },
});
