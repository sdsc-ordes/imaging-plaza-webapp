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
import {z} from 'zod'
import {getSupabaseAdmin, verifyAccessToken} from '../utils/supabase/admin'

// AuthHandler now validates Supabase access tokens. The client still
// presents the token in `x-firebase-appcheck` (legacy header name kept
// to avoid touching every fetch call in one go — phase 7 renames it).
// We also accept the standard `authorization: bearer <token>` because
// any new caller will use that.
const AuthRequest = transformReq(async req => {
  const headerToken =
    (req.headers['x-firebase-appcheck'] as string | undefined) ||
    extractBearer(req.headers['authorization'] as string | undefined)

  if (!headerToken) throw new UnauthorizedError()

  try {
    const user = await verifyAccessToken(headerToken)
    return wrapRequest(req, {user, userId: user.id})
  } catch (err) {
    console.error('auth: token verification failed', err)
    throw new UnauthorizedError()
  }
})

const extractBearer = (raw: string | undefined): string | undefined => {
  if (!raw) return undefined
  const match = /^bearer\s+(.+)$/i.exec(raw)
  return match?.[1]
}

// Server-side Supabase admin client (RLS bypass) provided to every
// handler so writes to public.profiles, etc. happen with service_role
// credentials. The handler itself decides who the operation is for via
// req.userId.
const SupabaseAdminProvider = singleElementProvider('supabaseAdmin', async () => getSupabaseAdmin())

const AppContext = ApplicationContext.build(buildConfig(z.object({})), () => SupabaseAdminProvider)

export const AuthHandler = buildHandler(
  AuthRequest,
  illegalArgumentErrorHandler.and(DefaultErrorHandler),
  AppContext
)

export const DefaultHandler = buildHandler(emptyRequestTransformer, DefaultErrorHandler, AppContext)
