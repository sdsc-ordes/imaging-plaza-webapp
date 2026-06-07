import {TypedFetch} from '@coteries/utils/api-utils'
import {SchemaSoftwareSourceCode} from '../components/Form/schema'
import {Filter} from '@/models/Filter'
import {getSupabaseClient} from '../utils/supabase/client'

// #MODIFY_SEARCH_2 here is where we call the backend
export const searchSoftwareInGraph = async (query: string, filters?: Filter[]) => {
  const adjustedQuery = query === '""' || query == "''" ? '' : query
  const urlParams = new URLSearchParams({query: adjustedQuery})
  if (filters && filters.some(filter => filter.selected.length > 0)) {
    urlParams.append('filters', JSON.stringify(filters))
  }
  return TypedFetch.get<SchemaSoftwareSourceCode[]>(
    `/api/softwares/search?${urlParams.toString()}`
  )
}

// Firestore's onSnapshot pushed updates live; the Supabase equivalent
// would be supabase.channel('profiles').on('postgres_changes', ...).
// That needs the supabase/realtime service, which crashes on IPv6-less
// hosts (this dev VM included — see /imaging-plaza/supabase/docker-
// compose.yml for the back-story). Fall back to polling every 15 s and
// return a real unsubscribe that clears the interval.
const POLL_INTERVAL_MS = 15_000

export const subscribeToUserSoftwareListWithGraph = (
  userId: string,
  setSoftwareList: (softs: string[]) => void,
  setBookmarkedList: (softs: string[]) => void
) => {
  let cancelled = false

  const refresh = async () => {
    const {data} = await getSupabaseClient()
      .from('profiles')
      .select('own_softwares, bookmarked_software')
      .eq('id', userId)
      .single<{own_softwares: string[] | null; bookmarked_software: string[] | null}>()
    if (cancelled || !data) return
    setSoftwareList(data.own_softwares ?? [])
    setBookmarkedList(data.bookmarked_software ?? [])
  }

  void refresh()
  const interval = setInterval(() => void refresh(), POLL_INTERVAL_MS)

  return () => {
    cancelled = true
    clearInterval(interval)
  }
}

// DELETE PLACEHOLDER
export const deleteSoftware = async (_softwareId: string) => {
  alert('delete disabled for now')
}
