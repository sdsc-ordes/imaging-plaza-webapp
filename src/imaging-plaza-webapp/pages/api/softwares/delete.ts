import {SchemaSoftwareSourceCode} from '../../../components/Form/schema'
import {deleteSoftware} from '../../../fetchers/sparqlFetchers.server'
import {AuthHandler} from '../../../server/handler'

export default AuthHandler.post(
  SchemaSoftwareSourceCode,
  SchemaSoftwareSourceCode,
  async (req, {users}) => {

    // Forcing deletion of temp graph when saving draft
    const tempgraph = "https://imaging-plaza.epfl.ch/temporaryGraph" as string
    const finalgraph = "https://imaging-plaza.epfl.ch/finalGraph" as string

    //Delete the software
    const repo = req.payload["schema:codeRepository"][0] as string

    // Deletion of final graph before the temporary one.
    await deleteSoftware(finalgraph, repo)
    await deleteSoftware(tempgraph, repo) 
    
    const doc = users.doc(req.userId);
    //console.log(doc)
    const user = (await doc.get()).data()!

    // Use the filter method to create a new array excluding mainRepository
    const updatedSoftwares = (user.own_softwares ?? []).filter(s => s !== repo);
    // console.log(updatedSoftwares);

    // Update the document in Firestore
    await doc.update({
        own_softwares: updatedSoftwares,
    });

    return req.payload;  // Replace with appropriate return value
  }
)
