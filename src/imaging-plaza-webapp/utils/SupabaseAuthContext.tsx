import type { User as SupabaseUser } from '@supabase/supabase-js'
import useTranslation from 'next-translate/useTranslation'
import { createContext, type ReactNode, useContext, useEffect, useState } from 'react'
import { Role, type User } from '../models/User'
import handleError from './dataHandling/handleError'
import { getSupabaseClient } from './supabase/client'

// Parallel to AuthContext.tsx. Phase 3 of docs/migrations/firebase-to-supabase.md
// adds this without removing the Firebase one — consumers stay on the
// Firebase context until later phases port them one by one.

interface Props {
  children: ReactNode
}

export type SupabaseAuthUser = (User & { supabase: SupabaseUser }) | null

interface ContextProps {
  user: SupabaseAuthUser
  isLoading: boolean
  loginWithEmail: (email: string, password: string) => Promise<void>
  loginWithGoogle: () => Promise<void>
  loginWithGitHub: () => Promise<void>
  logout: () => Promise<void>
}

const SupabaseAuthContext = createContext<ContextProps>({
  user: null,
  isLoading: true,
  loginWithEmail: async () => {},
  loginWithGoogle: async () => {},
  loginWithGitHub: async () => {},
  logout: async () => {},
})

export const useSupabaseAuth = () => useContext(SupabaseAuthContext)

// Schema-side row shape for `public.profiles` (snake_case as it comes
// back from PostgREST). Mapped to the shared User model below.
interface ProfileRow {
  id: string
  email: string
  first_name: string | null
  last_name: string | null
  role: Role
  bookmarked_software: string[]
  own_softwares: string[]
}

const profileToUser = (profile: ProfileRow): User => ({
  id: profile.id,
  email: profile.email,
  firstName: profile.first_name ?? '',
  lastName: profile.last_name ?? '',
  role: profile.role,
  bookmarked_software: profile.bookmarked_software ?? [],
  own_softwares: profile.own_softwares ?? [],
})

export const SupabaseAuthProvider = ({ children }: Props) => {
  const { t } = useTranslation()
  const [user, setUser] = useState<SupabaseAuthUser>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const supabase = getSupabaseClient()
    let active = true

    const loadProfile = async (sUser: SupabaseUser): Promise<SupabaseAuthUser> => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', sUser.id)
        .single<ProfileRow>()
      if (error || !data) return null
      return { ...profileToUser(data), supabase: sUser }
    }

    const hydrate = async (sUser: SupabaseUser | null) => {
      if (!sUser) {
        setUser(null)
        return
      }
      const u = await loadProfile(sUser)
      if (active) setUser(u)
    }

    supabase.auth
      .getSession()
      .then(({ data }) => hydrate(data.session?.user ?? null))
      .finally(() => {
        if (active) setIsLoading(false)
      })

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      hydrate(session?.user ?? null)
    })

    return () => {
      active = false
      sub.subscription.unsubscribe()
    }
  }, [])

  const loginWithEmail = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const { error } = await getSupabaseClient().auth.signInWithPassword({ email, password })
      if (error) {
        if (error.message.toLowerCase().includes('invalid login')) {
          handleError(error, t('account:login_error_password'))
        } else {
          handleError(error, t('account:login_error_generic'))
        }
      }
    } finally {
      setIsLoading(false)
    }
  }

  // OAuth in Supabase is redirect-based: signInWithOAuth navigates to the
  // provider, which navigates back to the configured callback URL. The
  // session lands during the next page load, observed by onAuthStateChange
  // above. These don't return a user; they hand control to the browser.
  const loginWithGoogle = async () => {
    setIsLoading(true)
    try {
      const { error } = await getSupabaseClient().auth.signInWithOAuth({ provider: 'google' })
      if (error) handleError(error, t('common:login_error_generic'))
    } finally {
      setIsLoading(false)
    }
  }

  const loginWithGitHub = async () => {
    setIsLoading(true)
    try {
      const { error } = await getSupabaseClient().auth.signInWithOAuth({ provider: 'github' })
      if (error) handleError(error, t('common:login_error_generic'))
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    await getSupabaseClient().auth.signOut()
    setUser(null)
  }

  return (
    <SupabaseAuthContext.Provider
      value={{ user, isLoading, loginWithEmail, loginWithGoogle, loginWithGitHub, logout }}
    >
      {children}
    </SupabaseAuthContext.Provider>
  )
}
