import {IllegalArgumentError} from '@/errors/IllegalArgumentError'
import {getSoftware} from '@/fetchers/sparqlFetchers.server'
import {TypedFetch} from '@coteries/utils/api-utils'
import {z} from 'zod'
import {SchemaSoftwareSourceCode} from '../../components/Form/schema'
import {GimiePayload} from '../../models/GimiePayload'
import {AuthHandler} from '../../server/handler'


/**
 * Retrieve gimie fields
 */

export default AuthHandler.post(SchemaSoftwareSourceCode.partial(), GimiePayload, async req => {
  console.debug("Gimie.ts - req.payload.respository : ", req.payload.repository)
  const url = `${process.env.IP_GIMIE_URL}/${req.payload.repository}`
  const software = await getSoftware(req.payload.repository)
  if (software) {
    throw new IllegalArgumentError('repository', req.payload.repository)
  }

  const response = await TypedFetch.get(url, {
    parser: z.object({
      link: z.string(),
      output: SchemaSoftwareSourceCode.deepPartial()
    }),
  })

  const schema = response.output

  // Quick solution for the name
  // This should be in the MS
  schema['schema:name'] = (schema['schema:name'] ?? '').split('/').pop() ?? '';

  return schema
})
