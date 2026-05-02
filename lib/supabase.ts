import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
// using service role key to bypass RLS for server operations
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""

// Dummy client si no hay URL en build time para evitar crashes de Next.js
export const supabase = supabaseUrl ? createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false
  }
}) : null as any // Type assertion to avoid massive rewrites in Next.js builds sin env vars.

