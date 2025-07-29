import {SchemaSoftwareSourceCode} from '../../../components/Form/schema'
import {postFinalSchema, rebuildIndex} from '../../../fetchers/sparqlFetchers.server'
import {makeKeywords} from '../../../fetchers/sparqlFetchers.server'
import {AuthHandler} from '../../../server/handler'

export default AuthHandler.post(SchemaSoftwareSourceCode, SchemaSoftwareSourceCode, async req => {
  await postFinalSchema(req.payload as SchemaSoftwareSourceCode)
  await makeKeywords()
  await rebuildIndex()

  return req.payload
})
