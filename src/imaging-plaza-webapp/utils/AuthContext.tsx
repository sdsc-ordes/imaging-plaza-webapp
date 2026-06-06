import type { User as SupabaseUser } from '@supabase/supabase-js'
import useTranslation from 'next-translate/useTranslation'
import { useRouter } from 'next/router'
import { createContext, type ReactNode, useContext, useEffect, useState } from 'react'
import { ROUTES_ACCOUNT, ROUTES_HOME } from '../constants/routes'
import {
  fetchLoginWEmail,
  fetchLoginWithGitHub,
  fetchLoginWithGoogle,
  fetchLogout,
  subscribeToAuthChange,
} from '../fetchers/auth'
import { User } from '../models/User'
import handleError from './dataHandling/handleError'

interface Props {
  children: ReactNode
}

// Underlying auth provider is now Supabase. The `.supabase` field is the
// raw GoTrue user (app_metadata, providers, etc.) for the handful of
// components that need it. The User fields cover everything else.
export type AuthUser = (User & { supabase: SupabaseUser }) | null

interface ContextProps {
  user: AuthUser
  isLoading: boolean
  loginWithEmail: (email: string, password: string) => void
  loginWithGoogle: () => void
  loginWithGitHub: () => void
  logout: () => void
}

const AuthContext = createContext<ContextProps>({
  user: null,
  isLoading: true,
  loginWithEmail: () => {},
  loginWithGoogle: () => {},
  loginWithGitHub: () => {},
  logout: () => {},
})

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }: Props) => {
  const router = useRouter()
  const { t } = useTranslation()

  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [user, setUser] = useState<AuthUser>(null)

  useEffect(() => {
    setIsLoading(true)
    const unsubscribe = subscribeToAuthChange((u, su) => {
      if (u && su) {
        setUser({ ...u, supabase: su })
      } else {
        setUser(null)
      }
      setIsLoading(false)
    })
    return () => unsubscribe()
  }, [])

  const postLogin = async () => {
    await router.push(ROUTES_ACCOUNT)
  }

  const loginWithGoogle = async () => {
    try {
      setIsLoading(true)
      await fetchLoginWithGoogle()
      // OAuth redirects away; no router.push needed (and it'd race).
    } catch (e: any) {
      handleError(e, t('common:login_error_generic'))
    }
  }

  const loginWithGitHub = async () => {
    try {
      setIsLoading(true)
      await fetchLoginWithGitHub()
    } catch (e: any) {
      handleError(e, t('common:login_error_generic'))
    }
  }

  const loginWithEmail = async (email: string, password: string) => {
    try {
      setIsLoading(true)
      await fetchLoginWEmail(email, password)
      await postLogin()
    } catch (e: any) {
      // GoTrue returns "Invalid login credentials" for either unknown
      // email or wrong password; surface a single generic message.
      handleError(e, t('account:login_error_generic'))
    }
  }

  const logout = async () => {
    await router.push(ROUTES_HOME)
    setUser(null)
    await fetchLogout()
  }

  const value = { user, isLoading, loginWithEmail, loginWithGoogle, loginWithGitHub, logout }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
