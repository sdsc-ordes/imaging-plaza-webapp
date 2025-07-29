import {SchemaSoftwareSourceCode} from '../../../components/Form/schema'
import {inferFairLevel, postDraftSchema, deleteSoftware, rebuildIndex} from '../../../fetchers/sparqlFetchers.server'
import {AuthHandler} from '../../../server/handler'

export default AuthHandler.post(
  SchemaSoftwareSourceCode,
  SchemaSoftwareSourceCode,
  async (req, {users}) => {
    const fairLevel = await inferFairLevel(req.payload as SchemaSoftwareSourceCode)
    
    // Forcing deletion of temp graph when saving draft
    const graph = "https://imaging-plaza.epfl.ch/temporaryGraph" as string
    const software = {...req.payload, 'imag:fairLevel': fairLevel, "imag:graph": graph} as SchemaSoftwareSourceCode


    //Delete the software
    const repo = req.payload["schema:codeRepository"][0] as string
    //const graph = req.payload["ex:graph"] as string

    await deleteSoftware(graph, repo) 

    // Previous CODE
    await postDraftSchema(software)
    await rebuildIndex()
    const doc = users.doc(req.userId)

    const user = (await doc.get()).data()!
    const mainRepository = software['schema:codeRepository'][0]

    // #FIREBASE_EXAMPLE_BACKEND
    await doc.update({
      own_softwares: [
        ...(user.own_softwares ?? []).filter(s => s !== mainRepository),
        mainRepository,
      ],
    })
    return software
  }
)
