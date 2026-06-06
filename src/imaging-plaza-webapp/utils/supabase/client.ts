import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Browser-side Supabase client. Reads the public URL + anon key, persists
// the session in localStorage, and refreshes tokens automatically.
//
// Cached as a module-level singleton so onAuthStateChange listeners and
// React hooks share the same instance and observe each other's state
// changes (same pattern the existing firebase.ts uses).

let client: SupabaseClient | null = null

export const getSupabaseClient = (): SupabaseClient => {
  if (client) return client

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !anonKey) {
    throw new Error(
      'NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be set'
    )
  }

  client = createClient(url, anonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  })
  return client
}
