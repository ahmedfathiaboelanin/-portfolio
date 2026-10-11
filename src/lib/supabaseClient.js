import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const isSupabaseConfigured = Boolean(url && anonKey)

if (!isSupabaseConfigured) {
  console.info(
    '[supabase] VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY missing — using local fallback data. See .env.example + supabase/schema.sql'
  )
}

// Export a null-safe client: every helper below must handle `supabase === null`.
export const supabase = isSupabaseConfigured
  ? createClient(url, anonKey, {
      auth: { persistSession: true, autoRefreshToken: true },
    })
  : null
