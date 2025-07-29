import {
  createUserWithEmailAndPassword,
  fetchSignInMethodsForEmail,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateEmail,
  updateProfile,
} from 'firebase/auth'
import {doc, getDoc, onSnapshot, setDoc} from 'firebase/firestore'
import {DB_COL_USER} from '../constants/dbCollections'
import {FirebaseUser, Role, User, createUserForFirestore} from '../models/User'
import {db} from '../utils/firebase/firebase'
import {auth, githubProvider, googleProvider} from '../utils/firebase/firebaseAuth'

export const fetchCheckEmail = async (email: string) => {
  return (await fetchSignInMethodsForEmail(auth, email)).length > 0
}

export const sendPasswordReset = async (email: string) => {
  return sendPasswordResetEmail(auth, email)
}

export const fetchCheckEmailProvider = async (email: string) => {
  return (await fetchSignInMethodsForEmail(auth, email)).pop()
}

export const fetchCreateAccountWEmail = async (email: string, password: string) => {
  return await createUserWithEmailAndPassword(auth, email, password)
}

export const fetchLoginWEmail = async (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password)
}

export const fetchLoginWithGoogle = async () => {
  return await signInWithPopup(auth, googleProvider)
}

export const fetchLoginWithGitHub = async () => {
  return await signInWithPopup(auth, githubProvider)
}

export const fetchLogout = async () => {
  await signOut(auth)
}

export const subscribeToAuthChange = (
  callback: (user: User | null, firebaseUser?: FirebaseUser) => void
) => {
  return onAuthStateChanged(auth, async fbu => {
    if (fbu) {
      const user = await getFromFirebase(fbu)
      callback(user, fbu)
      subscribeToUser(fbu, callback)
    } else {
      callback(null)
    }
  })
}

const addToFirebase = (fbu: FirebaseUser) => {
  const [id, user] = createUserForFirestore(fbu)
  const dbRef = doc(db, DB_COL_USER, id)
  setDoc(dbRef, user) // will retrigger onSnapshot
}

const getFromFirebase = async (fbu: FirebaseUser) => {
  // Error Firestore Uncaught Error in snapshot listener: FirebaseError: [code=permission-denied]: Missing or insufficient permissions.
  const user = await getDoc(doc(db, DB_COL_USER, fbu.uid))

  return {id: fbu.uid, ...user.data()} as User
}

const subscribeToUser = (
  firebaseUser: FirebaseUser,
  callback: (user: User, firebaseUser?: FirebaseUser) => void
) => {
  const dbRef = doc(db, DB_COL_USER, firebaseUser.uid)
  return onSnapshot(dbRef, doc => {
    if (doc.exists()) {
      callback({id: doc.id, ...(doc.data() as Omit<User, 'id'>)}, firebaseUser)
    } else {
      addToFirebase(firebaseUser)
    }
  })
}

export const fetchSetUser = async (
  firebaseUser: FirebaseUser,
  firstName: string,
  lastName: string,
  email?: string,
  role?: Role
) => {
  if (email) {
    await updateEmail(firebaseUser, email)
  }
  await updateProfile(firebaseUser, {displayName: `${firstName} ${lastName}`})
  const payload = Object.assign({}, {firstName, lastName}, email && {email}, role && {role})
  await setDoc(doc(db, 'users', firebaseUser.uid), payload, {merge: true})
}
