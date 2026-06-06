import {SchemaSoftwareSourceCode} from '../../../components/Form/schema'
import {inferFairLevel, postFinalSchema, deleteSoftware, makeKeywords, rebuildIndex} from '../../../fetchers/sparqlFetchers.server'
import {AuthHandler} from '../../../server/handler'

export default AuthHandler.post(
  SchemaSoftwareSourceCode,
  SchemaSoftwareSourceCode,
  async (req, {supabaseAdmin}) => {
    const fairLevel = await inferFairLevel(req.payload as SchemaSoftwareSourceCode)

    const tempgraph = 'https://imaging-plaza.epfl.ch/temporaryGraph' as string
    const finalgraph = 'https://imaging-plaza.epfl.ch/finalGraph' as string

    const software = {
      ...req.payload,
      'imag:fairLevel': fairLevel,
      'imag:graph': finalgraph,
    } as SchemaSoftwareSourceCode

    const repo = req.payload['schema:codeRepository'][0] as string
    // Deletion of final graph before the temporary one.
    await deleteSoftware(finalgraph, repo)
    await deleteSoftware(tempgraph, repo)

    await postFinalSchema(software as SchemaSoftwareSourceCode)

    const mainRepository = software['schema:codeRepository'][0]
    const {data: profile} = await supabaseAdmin
      .from('profiles')
      .select('own_softwares')
      .eq('id', req.userId)
      .single<{own_softwares: string[] | null}>()
    const nextOwned = [
      ...(profile?.own_softwares ?? []).filter(s => s !== mainRepository),
      mainRepository,
    ]
    await supabaseAdmin
      .from('profiles')
      .update({own_softwares: nextOwned})
      .eq('id', req.userId)

    await makeKeywords()
    await rebuildIndex()
    return req.payload
  }
)
