import type { User } from '../models/User'
import { getSupabaseClient } from '../utils/supabase/client'

const writeBookmarks = async (user: User, bookmarks: string[]) => {
  const { error } = await getSupabaseClient()
    .from('profiles')
    .update({ bookmarked_software: bookmarks })
    .eq('id', user.id)
  if (error) throw error
}

export const addBookmark = async (user: User, softwareId: string) => {
  const next = Array.from(new Set([...user.bookmarked_software, softwareId]))
  await writeBookmarks(user, next)
}

export const removeBookmark = async (user: User, softwareId: string) => {
  const next = user.bookmarked_software.filter(id => id !== softwareId)
  await writeBookmarks(user, next)
}
