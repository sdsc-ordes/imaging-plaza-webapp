import {SchemaSoftwareSourceCode} from '../../../components/Form/schema'
import {getSoftware} from '../../../fetchers/sparqlFetchers.server'
import {AuthHandler} from '../../../server/handler'

export default AuthHandler.get(SchemaSoftwareSourceCode, async req => {
  const repo = req.query.repository as string
  if (!repo) throw new Error('provide repository')

  return getSoftware(repo)
})
