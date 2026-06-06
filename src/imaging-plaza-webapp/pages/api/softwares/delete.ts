import {SchemaSoftwareSourceCode} from '../../../components/Form/schema'
import {deleteSoftware} from '../../../fetchers/sparqlFetchers.server'
import {AuthHandler} from '../../../server/handler'

export default AuthHandler.post(
  SchemaSoftwareSourceCode,
  SchemaSoftwareSourceCode,
  async (req, {supabaseAdmin}) => {
    const tempgraph = 'https://imaging-plaza.epfl.ch/temporaryGraph' as string
    const finalgraph = 'https://imaging-plaza.epfl.ch/finalGraph' as string

    const repo = req.payload['schema:codeRepository'][0] as string

    // Deletion of final graph before the temporary one.
    await deleteSoftware(finalgraph, repo)
    await deleteSoftware(tempgraph, repo)

    const {data: profile} = await supabaseAdmin
      .from('profiles')
      .select('own_softwares')
      .eq('id', req.userId)
      .single<{own_softwares: string[] | null}>()
    const nextOwned = (profile?.own_softwares ?? []).filter(s => s !== repo)
    await supabaseAdmin
      .from('profiles')
      .update({own_softwares: nextOwned})
      .eq('id', req.userId)

    return req.payload
  }
)
