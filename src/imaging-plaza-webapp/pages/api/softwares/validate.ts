import {SchemaSoftwareSourceCode} from '../../../components/Form/schema'
import {inferFairLevel, postFinalSchema, deleteSoftware, makeKeywords, rebuildIndex} from '../../../fetchers/sparqlFetchers.server'
import {AuthHandler} from '../../../server/handler'

export default AuthHandler.post(
  SchemaSoftwareSourceCode,
  SchemaSoftwareSourceCode,
  async (req, {users}) => {
    const fairLevel = await inferFairLevel(req.payload as SchemaSoftwareSourceCode)
    
    // Forcing deletion of temp graph when saving draft
    const tempgraph = "https://imaging-plaza.epfl.ch/temporaryGraph" as string
    const finalgraph = "https://imaging-plaza.epfl.ch/finalGraph" as string

    const software = {...req.payload, 'imag:fairLevel': fairLevel, "imag:graph": finalgraph} as SchemaSoftwareSourceCode
    
    //Delete the software
    const repo = req.payload["schema:codeRepository"][0] as string

    // Deletion of final graph before the temporary one.
    await deleteSoftware(finalgraph, repo)
    await deleteSoftware(tempgraph, repo) 


    // Final post of the software
    await postFinalSchema(software as SchemaSoftwareSourceCode)
    
    const doc = users.doc(req.userId)
    const user = (await doc.get()).data()!
    const mainRepository = software['schema:codeRepository'][0]
    await doc.update({
      own_softwares: [
        ...(user.own_softwares ?? []).filter(s => s !== mainRepository),
        mainRepository,
      ],
    })
    await makeKeywords()
    await rebuildIndex()
    return req.payload
  }
)
