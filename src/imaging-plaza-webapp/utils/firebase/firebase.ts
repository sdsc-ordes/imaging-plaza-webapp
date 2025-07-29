import {getApps, initializeApp} from 'firebase/app'
import {AppCheck, ReCaptchaV3Provider, initializeAppCheck} from 'firebase/app-check'
import {getFirestore} from 'firebase/firestore'
import {getStorage} from 'firebase/storage'

export const DB_COL_SUPPORT = 'contactForm'

// #CLONE_DB here is how the values are retrieved
// To clone firebase please refer to their documentation
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_AUTHDOMAIN,
  projectId: process.env.NEXT_PUBLIC_PROJECTID,
  storageBucket: process.env.NEXT_PUBLIC_STORAGEBUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGINGSENDERID,
  appId: process.env.NEXT_PUBLIC_APPID,
}
export const firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]

let appCheck: AppCheck | null = null
export const getAppCheck = (): AppCheck => {
  if (!appCheck) {
    appCheck = initializeAppCheck(firebaseApp, {
      provider: new ReCaptchaV3Provider('6LfxbVwnAAAAALwX7ZRDVqOUSDG5t_osONeE5uXI'),

      // Optional argument. If true, the SDK automatically refreshes App Check
      // tokens as needed.
      isTokenAutoRefreshEnabled: true,
    })
  }
  return appCheck
}

const db = getFirestore(firebaseApp)
const storage = getStorage(firebaseApp)

export {db, storage}
