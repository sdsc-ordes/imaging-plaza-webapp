import { getSupabaseClient } from './client'

// Pull the current Supabase access token. Returns undefined if there is
// no active session (caller should treat the request as anonymous).
export const getAccessToken = async (): Promise<string | undefined> => {
  const { data } = await getSupabaseClient().auth.getSession()
  return data.session?.access_token
}

// Build the Authorization header value for an authenticated request.
// Returns an empty string when there is no session so callers can still
// drop it into a Headers object without conditionals.
export const bearerHeader = async (): Promise<string> => {
  const token = await getAccessToken()
  return token ? `Bearer ${token}` : ''
}
