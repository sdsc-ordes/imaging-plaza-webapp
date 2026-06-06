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

// Firestore's onSnapshot pushed updates live. Postgres realtime would
// need the supabase/realtime service, which the dev stack does not run.
// For now do a one-shot fetch from public.profiles and return a no-op
// unsubscribe. Consumers re-render bookmarks on every page transition
// anyway; missed updates show up on the next mount.
export const subscribeToUserSoftwareListWithGraph = (
  userId: string,
  setSoftwareList: (softs: string[]) => void,
  setBookmarkedList: (softs: string[]) => void
) => {
  void getSupabaseClient()
    .from('profiles')
    .select('own_softwares, bookmarked_software')
    .eq('id', userId)
    .single<{own_softwares: string[] | null; bookmarked_software: string[] | null}>()
    .then(({data}) => {
      if (!data) return
      setSoftwareList(data.own_softwares ?? [])
      setBookmarkedList(data.bookmarked_software ?? [])
    })

  return () => {}
}

// DELETE PLACEHOLDER
export const deleteSoftware = async (_softwareId: string) => {
  alert('delete disabled for now')
}
