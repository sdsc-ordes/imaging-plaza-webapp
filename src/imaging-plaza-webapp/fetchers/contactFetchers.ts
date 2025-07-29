import {addDoc, collection} from 'firebase/firestore'
import {SupportMessage} from '../models/SupportMessage'
import {db, DB_COL_SUPPORT} from '../utils/firebase/firebase'

export const writeSupportMessage = async (message: SupportMessage) => {
  return await addDoc(collection(db, DB_COL_SUPPORT), {...message})
}
