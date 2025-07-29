import { collection, onSnapshot, query, where } from 'firebase/firestore'

import { TypedFetch } from '@coteries/utils/api-utils'
import { SchemaSoftwareSourceCode } from '../components/Form/schema'
import { DB_COL_USER } from '../constants/dbCollections'
import { User } from '../models/User'
import { db } from '../utils/firebase/firebase'
import { Filter } from '@/models/Filter'


// #MODIFY_SEARCH_2 here is where we call the backend
export const searchSoftwareInGraph = async (query: string, filters?: Filter[]) => {

  const adjustedQuery = query === '""' || query == "''" ? '' : query;
  const urlParams = new URLSearchParams({ query: adjustedQuery });
  if (filters && filters.some(filter => filter.selected.length > 0)) {
    urlParams.append('filters', JSON.stringify(filters));
  }
  return TypedFetch.get<SchemaSoftwareSourceCode[]>(`/api/softwares/search?${urlParams.toString()}`)
}

export const subscribeToUserSoftwareListWithGraph = (
  userId: string,
  setSoftwareList: (softs: string[]) => void,
  setBookmarkedList: (softs: string[]) => void
) =>
  onSnapshot(
    query(collection(db, DB_COL_USER), where('firebaseUserId', '==', userId)),
    async querySnapshot => {
      const user = querySnapshot.docs[0].data() as User
      setSoftwareList(user.own_softwares ?? [])
      setBookmarkedList(user.bookmarked_software)
    }
  )

// DELETE PLACEHOLDER
export const deleteSoftware = async (softwareId: string) => {
  alert('delete disabled for now')
}
