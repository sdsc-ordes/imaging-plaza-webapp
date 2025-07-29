import {TeamMemberZod} from '../models/TeamMember'
import {DB_COL_TEAM_MEMBER} from '../constants/dbCollections'
import admin from '../utils/firebase/firebaseAdmin'

const db = admin.firestore()
const teamMemberCollection = db.collection(DB_COL_TEAM_MEMBER)

export const getTeamMembers = async () => {
  try {
    const data = await teamMemberCollection.get()
    return data.docs.map(doc => TeamMemberZod.parse({...doc.data(), id: doc.id}))
  } catch (e) {
    console.error(e)
  }
}
