import {getAuth, GithubAuthProvider, GoogleAuthProvider} from 'firebase/auth'
import {firebaseApp} from './firebase'

export const auth = getAuth(firebaseApp)

export const googleProvider = new GoogleAuthProvider()
export const githubProvider = new GithubAuthProvider()
