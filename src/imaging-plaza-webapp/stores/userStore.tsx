import {omit} from '@coteries/utils'
import {TypedFetch} from '@coteries/utils/api-utils'
import {getAuth} from 'firebase/auth'
import {PropsWithChildren, useEffect} from 'react'
import {create} from 'zustand'
import {SchemaSoftwareSourceCode} from '../components/Form/schema'
import {subscribeToUserSoftwareListWithGraph} from '../fetchers/softwareFetchers'
import {AuthUser, useAuth} from '../utils/AuthContext'

export type UserStore = {
  ownSoftwares: SchemaSoftwareSourceCode[]
  bookmarks: SchemaSoftwareSourceCode[]
}
type PrivateUserStore = {
  subscribe: (user: AuthUser) => () => void
}

const getSoftwaresFromGraph = async (softs: string[]) => {
  const token = await getAuth().currentUser!.getIdToken()
  const softwares = await Promise.all(
    softs.map(s =>
      TypedFetch.get<SchemaSoftwareSourceCode>(`/api/softwares/get?repository=${s}`, {
        headers: {
          'X-Firebase-AppCheck': token,
        },
      }).catch(e => undefined)
    )
  )
  return softwares.filter(s => !!s) as SchemaSoftwareSourceCode[]
}
const UserStore = create<UserStore & PrivateUserStore>((set, get) => ({
  ownSoftwares: [],
  bookmarks: [],
  idToken: '',
  subscribe: user => {
    const fn = async () => {
      const ownSoftwares = await getSoftwaresFromGraph(user!.own_softwares ?? [])
      set({ownSoftwares})
      const bookmarks = await getSoftwaresFromGraph(user!.bookmarked_software ?? [])
      set({bookmarks})
    }
    fn()
    const subscription = subscribeToUserSoftwareListWithGraph(
      user!.id,
      async softs => {
        set({ownSoftwares: await getSoftwaresFromGraph(softs)})
      },
      async softs =>
        set({bookmarks: (await getSoftwaresFromGraph(softs)) as SchemaSoftwareSourceCode[]})
    )

    return subscription
  },
}))

export const useUserStore = <S = UserStore,>(selector?: (s: UserStore) => S): S =>
  UserStore(
    selector ?? (((s: UserStore) => omit(s, 'subscribe' as keyof UserStore) as UserStore) as any)
  )

export const WithUserStore = ({children}: PropsWithChildren) => {
  const sub = UserStore(s => s.subscribe)
  const {user} = useAuth()

  useEffect(() => {
    if (user) return sub(user)
  }, [user])
  return <>{children}</>
}
