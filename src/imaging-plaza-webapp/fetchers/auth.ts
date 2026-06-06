// Supabase-backed implementation that preserves the public signatures the
// rest of the codebase imports from this file. After phase 10 the import
// of `firebase/auth` and `firebase/firestore` from any caller is removed;
// until then, this file is the bridge.

import type { User as SupabaseUser } from '@supabase/supabase-js'
import { Role, type User } from '../models/User'
import { getSupabaseClient } from '../utils/supabase/client'

const profileToUser = (row: {
  id: string
  email: string
  first_name: string | null
  last_name: string | null
  role: Role
  bookmarked_software: string[] | null
  own_softwares: string[] | null
}): User => ({
  id: row.id,
  email: row.email,
  firstName: row.first_name ?? '',
  lastName: row.last_name ?? '',
  role: row.role,
  bookmarked_software: row.bookmarked_software ?? [],
  own_softwares: row.own_softwares ?? [],
})

const hydrateUser = async (userId: string): Promise<User | null> => {
  const { data, error } = await getSupabaseClient()
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  if (error || !data) return null
  return profileToUser(data)
}

// GoTrue intentionally hides whether an email is registered (avoids
// account-enumeration). Keep the export so callers don't break; always
// return false so the create-account flow proceeds to the password step,
// where signup surfaces the real "already registered" error.
export const fetchCheckEmail = async (_email: string): Promise<boolean> => false

// Same reasoning. Always answer "password" so legacy provider-aware
// branches in the UI keep working.
export const fetchCheckEmailProvider = async (_email: string): Promise<string> => 'password'

export const sendPasswordReset = async (email: string) => {
  const { error } = await getSupabaseClient().auth.resetPasswordForEmail(email)
  if (error) throw error
}

export const fetchCreateAccountWEmail = async (email: string, password: string) => {
  const { data, error } = await getSupabaseClient().auth.signUp({ email, password })
  if (error) throw error
  return { user: data.user }
}

export const fetchLoginWEmail = async (email: string, password: string) => {
  const { data, error } = await getSupabaseClient().auth.signInWithPassword({ email, password })
  if (error) throw error
  return { user: data.user }
}

// Supabase OAuth is redirect-based: the call kicks the browser to the
// provider and returns immediately. There is no Firebase-style popup that
// resolves with a user. Callers that awaited a `user` get null here; the
// real session lands during the next page load and is picked up by
// subscribeToAuthChange below.
export const fetchLoginWithGoogle = async () => {
  const { error } = await getSupabaseClient().auth.signInWithOAuth({ provider: 'google' })
  if (error) throw error
  return { user: null }
}

export const fetchLoginWithGitHub = async () => {
  const { error } = await getSupabaseClient().auth.signInWithOAuth({ provider: 'github' })
  if (error) throw error
  return { user: null }
}

export const fetchLogout = async () => {
  await getSupabaseClient().auth.signOut()
}

export const subscribeToAuthChange = (
  callback: (user: User | null, supabaseUser?: SupabaseUser) => void
) => {
  const supabase = getSupabaseClient()

  const emit = async (su: SupabaseUser | null) => {
    if (!su) return callback(null)
    const user = await hydrateUser(su.id)
    callback(user, su)
  }

  // Initial hydration so subscribers see the current session immediately,
  // not just on the next state change.
  void supabase.auth.getSession().then(({ data }) => emit(data.session?.user ?? null))

  const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
    void emit(session?.user ?? null)
  })

  return () => sub.subscription.unsubscribe()
}

export const fetchSetUser = async (
  user: User,
  firstName: string,
  lastName: string,
  email?: string,
  role?: Role
) => {
  const supabase = getSupabaseClient()

  if (email && email !== user.email) {
    const { error } = await supabase.auth.updateUser({ email })
    if (error) throw error
  }

  const payload: Record<string, unknown> = { first_name: firstName, last_name: lastName }
  if (email) payload.email = email
  if (role) payload.role = role

  const { error } = await supabase.from('profiles').update(payload).eq('id', user.id)
  if (error) throw error
}
