import { createClient, SupabaseClient, User } from '@supabase/supabase-js'

// Server-side Supabase client with the service_role key. Bypasses Row
// Level Security, so this MUST never be imported from any file that ends
// up in the browser bundle. Use it only from `pages/api/*`, `*.server.ts`,
// and `getServerSideProps`.
//
// Cached as a module-level singleton on the server. Each Next.js API
// worker gets one instance.

let admin: SupabaseClient | null = null

export const getSupabaseAdmin = (): SupabaseClient => {
  if (admin) return admin

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceRoleKey) {
    throw new Error(
      'NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set'
    )
  }

  admin = createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
  return admin
}

// Verify an access token coming in via the Authorization header. Returns
// the User if the token is valid and not expired; throws otherwise.
//
// This is the Supabase equivalent of `getAuth().verifyIdToken(token)`
// from firebase-admin used by AuthHandler today. The actual swap of
// AuthHandler happens in phase 6 of the migration plan.
export const verifyAccessToken = async (token: string): Promise<User> => {
  const { data, error } = await getSupabaseAdmin().auth.getUser(token)
  if (error || !data.user) {
    throw new Error(error?.message ?? 'invalid access token')
  }
  return data.user
}
