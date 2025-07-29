import {arrayRemove, arrayUnion, doc, updateDoc} from 'firebase/firestore'
import {DB_COL_USER} from '../constants/dbCollections'
import {User} from '../models/User'
import {db} from '../utils/firebase/firebase'

// #FIREBASE_EXAMPLE_FRONTEND here is an example for the frontend, please refer to the doc for the rest
export const addBookmark = async (user: User, softwareId: string) => {
  const userRef = doc(db, DB_COL_USER, user.id)
  await updateDoc(userRef, {bookmarked_software: arrayUnion(softwareId)})
}

export const removeBookmark = async (user: User, softwareId: string) => {
  const userRef = doc(db, DB_COL_USER, user.id)
  await updateDoc(userRef, {bookmarked_software: arrayRemove(softwareId)})
}
