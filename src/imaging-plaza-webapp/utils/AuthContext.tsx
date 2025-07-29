import {type User as FirebaseUser} from 'firebase/auth'
import useTranslation from 'next-translate/useTranslation'
import {useRouter} from 'next/router'
import {createContext, type ReactNode, useState, useContext, useEffect} from 'react'
import {ROUTES_ACCOUNT, ROUTES_HOME} from '../constants/routes'
import {
  fetchLoginWEmail,
  fetchLoginWithGitHub,
  fetchLoginWithGoogle,
  fetchLogout,
  subscribeToAuthChange,
} from '../fetchers/auth'
import {User} from '../models/User'
import handleError from './dataHandling/handleError'

interface Props {
  children: ReactNode
}

export type AuthUser = (User & {firebase: FirebaseUser}) | null
interface contextProps {
  user: AuthUser
  isLoading: boolean
  loginWithEmail: (email: string, password: string) => void
  loginWithGoogle: () => void
  loginWithGitHub: () => void
  logout: () => void
}

const AuthContext = createContext<contextProps>({
  user: null,
  isLoading: true,
  loginWithEmail: () => {},
  loginWithGoogle: () => {},
  loginWithGitHub: () => {},
  logout: () => {},
})

export const useAuth = () => {
  return useContext(AuthContext)
}

export const AuthProvider = ({children}: Props) => {
  const router = useRouter()
  const {t} = useTranslation()

  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [user, setUser] = useState<AuthUser>(null)

  useEffect(() => {
    setIsLoading(true)

    subscribeToAuthChange((user, firebase) => {
      if (user) {
        setUser({...user, firebase: firebase!})
      }

      setIsLoading(false)
    })
  }, [])

  const postLogin = async (fbu: FirebaseUser) => {
    await router.push(ROUTES_ACCOUNT)
  }

  const loginWithGoogle = async () => {
    try {
      setIsLoading(true)
      const {user} = await fetchLoginWithGoogle()
      postLogin(user)
    } catch (e: any) {
      if (e.code !== 'auth/popup-closed-by-user') {
        handleError(e, t('common:login_error_generic'))
      }
    }
  }

  const loginWithGitHub = async () => {
    try {
      setIsLoading(true)
      const {user} = await fetchLoginWithGitHub()
      postLogin(user)
    } catch (e: any) {
      if (e.code !== 'auth/popup-closed-by-user') {
        handleError(e, t('common:login_error_generic'))
      }
    }
  }

  const loginWithEmail = async (email: string, password: string) => {
    try {
      setIsLoading(true)
      const {user} = await fetchLoginWEmail(email, password)
      postLogin(user)
    } catch (e: any) {
      if (e.code === 'auth/user-not-found') {
        handleError(e, t('account:login_error_not_found'))
      } else if (e.code === 'auth/wrong-password') {
        handleError(e, t('account:login_error_password'))
      } else {
        handleError(e, t('account:login_error_generic'))
      }
    }
  }

  const logout = async () => {
    await router.push(ROUTES_HOME)
    setUser(null)
    await fetchLogout()
  }

  const value = {
    user,
    isLoading,
    loginWithEmail,
    loginWithGoogle,
    loginWithGitHub,
    logout,
  }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
