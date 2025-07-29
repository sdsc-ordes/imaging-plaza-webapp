import {IllegalArgumentError} from '@/errors/IllegalArgumentError'
import {getSoftware} from '@/fetchers/sparqlFetchers.server'
import {TypedFetch} from '@coteries/utils/api-utils'
import {z} from 'zod'
import {SchemaSoftwareSourceCode} from '../../components/Form/schema'
import {GimiePayload} from '../../models/GimiePayload'
import {RootTriplet} from '../../models/Triplet'
import {AuthHandler} from '../../server/handler'
import {tripletsToSoftware} from '../../utils/software/tripletsToSoftware'


/**
 * Retrieve gimie fields
 * #INSERT_PREFILL_1: copy
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
      output: z.string()
    }),
  })

  const result = RootTriplet.array().parse(JSON.parse(response.output))
  console.debug("Gimie.ts result by gimie", result)

  const schema = tripletsToSoftware(result)
  console.debug("Gimie.ts schema by gimie", schema)


  // Quick solution for the name
  schema['schema:name'] = (schema['schema:name'] ?? '').split('/').pop();

  return schema
})
