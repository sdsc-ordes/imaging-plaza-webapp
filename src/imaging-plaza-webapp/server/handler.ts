import {illegalArgumentErrorHandler} from '@/errors/IllegalArgumentError'
import {
  ApplicationContext,
  DefaultErrorHandler,
  UnauthorizedError,
  buildHandler,
  emptyRequestTransformer,
  transformReq,
  wrapRequest,
} from '@coteries/next'
import {buildConfig} from '@coteries/utils'
import {singleElementProvider} from '@coteries/utils/provider'
import {getAuth} from 'firebase-admin/auth'
import {getFirestore} from 'firebase-admin/firestore'
import {z} from 'zod'
import {UserFirestoreConverter} from '../models/User'
import '../utils/firebase/firebaseAdmin'

const AuthRequest = transformReq(async req => {
  const appCheckToken = req.headers['x-firebase-appcheck'] as string | undefined
  if (!appCheckToken) {
    throw new UnauthorizedError()
  }

  try {
    const token = await getAuth().verifyIdToken(appCheckToken)

    // If verifyToken() succeeds, continue with the next middleware
    // function in the stack.
    return wrapRequest(req, {token, userId: token.sub})
  } catch (err) {
    console.error(err)
    throw new UnauthorizedError()
  }
})

// #FIREBASE_EXAMPLE_BACKEND here is how we get the users collection from firebase into every handler
const UsersProvider = singleElementProvider('users', async () =>
  getFirestore().collection('users').withConverter(UserFirestoreConverter)
)
const AppContext = ApplicationContext.build(buildConfig(z.object({})), () => UsersProvider)

export const AuthHandler = buildHandler(
  AuthRequest,
  illegalArgumentErrorHandler.and(DefaultErrorHandler),
  AppContext
)

export const DefaultHandler = buildHandler(emptyRequestTransformer, DefaultErrorHandler, AppContext)
