import {SchemaSoftwareSourceCode} from '../../../components/Form/schema'
import {searchSoftwares} from '../../../fetchers/sparqlFetchers.server'
import {DefaultHandler} from '../../../server/handler'

// #MODIFY_SEARCH_1 here is how the data is searched
export default DefaultHandler.get(SchemaSoftwareSourceCode.array(), async req => {
  const query = req.query.query as string
  const filters = req.query.filters ? JSON.parse(req.query.filters as string) : [];

  // const filters something
  //if (!query) throw new Error('provide repository')
  return searchSoftwares(query, filters)
})
