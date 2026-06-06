export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  role: Role
  bookmarked_software: string[]
  own_softwares?: string[]
}

export enum Role {
  USER = 'user',
  ADMIN = 'admin',
}
