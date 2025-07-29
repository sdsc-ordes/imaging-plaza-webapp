import {type User as FirebaseUser} from 'firebase/auth'
export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  role: Role
  bookmarked_software: string[]
  own_softwares?: string[]
}

export {type FirebaseUser}

export const createUserForFirestore = (fbUser: FirebaseUser): [string, Omit<User, 'id'>] => {
  const nameParts = fbUser.displayName?.split(' ')
  const [lastName, ...firstNameParts] = nameParts?.reverse() ?? (['', ['']] as const)
  const firstName = firstNameParts.reverse().join(' ')
  return [
    fbUser.uid,
    {
      firstName,
      lastName,
      email: fbUser.email!,
      role: Role.USER,
      bookmarked_software: [],
    },
  ]
}
export enum Role {
  USER = 'user',
  ADMIN = 'admin',
}

export const UserFirestoreConverter = {
  toFirestore: (data: User) => data,
  fromFirestore: (snap: FirebaseFirestore.QueryDocumentSnapshot) => snap.data() as User,
}
