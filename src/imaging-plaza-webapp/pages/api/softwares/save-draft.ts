import {SchemaSoftwareSourceCode} from '../../../components/Form/schema'
import {inferFairLevel, postDraftSchema, deleteSoftware, rebuildIndex} from '../../../fetchers/sparqlFetchers.server'
import {AuthHandler} from '../../../server/handler'

export default AuthHandler.post(
  SchemaSoftwareSourceCode,
  SchemaSoftwareSourceCode,
  async (req, {supabaseAdmin}) => {
    const fairLevel = await inferFairLevel(req.payload as SchemaSoftwareSourceCode)

    // Forcing deletion of temp graph when saving draft
    const graph = 'https://imaging-plaza.epfl.ch/temporaryGraph' as string
    const software = {
      ...req.payload,
      'imag:fairLevel': fairLevel,
      'imag:graph': graph,
    } as SchemaSoftwareSourceCode

    const repo = req.payload['schema:codeRepository'][0] as string
    await deleteSoftware(graph, repo)

    await postDraftSchema(software)
    await rebuildIndex()

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

    return software
  }
)
