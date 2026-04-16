import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
// using service role key to bypass RLS for server operations
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""

export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false
  }
})
