import admin from 'firebase-admin'
import {firebaseAdminConfig} from './adminConfig'

try {
  admin.initializeApp({
    // @ts-ignore
    credential: admin.credential.cert(firebaseAdminConfig),
  })
} catch (error: any) {
  if (error.code !== 'app/duplicate-app') {
    console.log(error)
  }
}

export default admin
