import {DB_COL_FAQ} from '../constants/dbCollections'
import {FAQZod} from '../models/Faq'
import admin from '../utils/firebase/firebaseAdmin'
import DOMPurify from 'isomorphic-dompurify'

const db = admin.firestore()

// #CHANGE_FAQ it looks like it is in firebase
// I would suggest to put them in the frontend directly, it makes no sense to put that in a database....
const faqCollection = db.collection(DB_COL_FAQ)

export const getFaq = async () => {
  try {
    const data = await faqCollection.orderBy('categoryOrder').get()
    return data.docs.map(doc => {
      const rawData = doc.data()
      return FAQZod.parse({
        ...rawData,
        id: doc.id,
        answerEn: DOMPurify.sanitize(rawData.answerEn)
      })
    })
  } catch (e) {
    console.error(e)
  }
}
