import {User} from '../models/User'

export const isBookmarked = (softwareId: string, user: User | null) => {
  return !!user?.bookmarked_software?.includes(softwareId)
}
