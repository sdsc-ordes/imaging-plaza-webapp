import { addContext } from '@/utils/schema-utils'
import { omit } from '@coteries/utils'
import { TypedFetch } from '@coteries/utils/api-utils'
import { z } from 'zod'
import { SchemaSoftwareSourceCode } from '../components/Form/schema'
import { RootTriplet } from '../models/Triplet'
import { tripletsToSoftware } from '../utils/software/tripletsToSoftware'
import { Filter } from '@/models/Filter'
// import { OS_FILTERS } from '@/constants/softwareProperties'
// import { resourceLimits } from 'worker_threads'

const POST_URL = `${process.env.IP_DB_URL}/rest/repositories/imagingplaza/import/upload/text`
const INFER_URL = process.env.IP_INFERENCE_URL as string
const GET_URL = `${process.env.IP_DB_URL}/repositories/imagingplaza`
const DELETE_URL = `${process.env.IP_DB_URL}/repositories/imagingplaza/statements`

const AuthorizationHeaders = {
  Authorization: 'Basic ' + Buffer.from(process.env.IP_AUTH as string).toString('base64'),
}

const base = {
  name: 'Text snippet test',
  format: 'application/ld+json',
  type: 'text',
}

const draft = {
  ...base,
  context: 'https://imaging-plaza.epfl.ch/temporaryGraph',
}

const final = {
  ...base,
  context: 'https://imaging-plaza.epfl.ch/finalGraph',
}

const getQuery = (repo: string) => `
PREFIX : <https://imaging-plaza.epfl.ch/>
CONSTRUCT {
  ?subject :graph ?g .
  ?subject ?predicate ?object .
  ?object ?p ?o .
  ?o ?something ?else .
} WHERE {
   GRAPH ?g{
     {
    {?subject ?predicate ?object .
     filter(?subject = <${repo}> )
    OPTIONAL { ?object ?p ?o . 
      OPTIONAL {?o ?something ?else}}
            }}}} 
`
export const postDraftSchema = async (schema: SchemaSoftwareSourceCode) => {
  const payload = {
    ...draft,
    data: JSON.stringify(addContext(schema)),
  }

  return TypedFetch.post(POST_URL, payload, {
    headers: AuthorizationHeaders,
  })
}

export const postFinalSchema = async (schema: SchemaSoftwareSourceCode) => {
  return TypedFetch.post(
    POST_URL,
    {
      ...final,
      data: JSON.stringify(addContext(schema)),
    },
    {
      headers: AuthorizationHeaders,
    }
  )
}

export const inferFairLevel = async (schema: Partial<SchemaSoftwareSourceCode>) => {
  // Convert the schema to JSON-LD format
  const jsonldData = JSON.stringify(addContext(schema))
  
  // Create FormData for multipart/form-data request
  const formData = new FormData()
  
  // Use Blob instead of File for better Node.js compatibility
  const blob = new Blob([jsonldData], { type: 'application/ld+json' })
  formData.append('data', blob, 'data.jsonld')

  const response = await fetch(INFER_URL, {
    method: 'POST',
    headers: {
      Accept: 'application/ld+json', // Explicitly set the Accept header
    },
    body: formData,
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error('Inference API error:', errorText)
    throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`)
  }

  // Since the response is a file with JSON-LD content, parse it as JSON directly
  const result = await response.json()
  console.log('Raw response from inference API:', JSON.stringify(result, null, 2))
  
  // The result should already be the JSON-LD array, not wrapped in an object
  // So we parse it directly as RootTriplet array
  const parsedResponse = RootTriplet.array().parse(result)
  console.log('Parsed response:', JSON.stringify(parsedResponse, null, 2))

  const element: RootTriplet = parsedResponse[0]
  console.log('First element:', JSON.stringify(element, null, 2))
  
  const obj = omit(element, '@id')
  console.log('Object without @id:', JSON.stringify(obj, null, 2))
  
  const values = Object.values(obj)[0]
  console.log('Values:', JSON.stringify(values, null, 2))
  
  const fairLevelStr = values.reduce(
    (acc, a) => (acc.localeCompare(a['@value'] ?? '') > 0 ? acc : a['@value']!),
    ''
  )

  console.log('Final fair level string:', fairLevelStr)
  return fairLevelStr
}

const SearchSoftwareResult = z.object({
  head: z.object({
    vars: z.string().array(),
  }),
  results: z.object({
    bindings: z.record(z.string(), z.object({ type: z.string(), value: z.string() })).array(),
  }),
})

// This function searches for software based on a search term and filters.
export const searchSoftwares = async (search?: string, filters?: Filter[]) => {

  const formattedFilters = (filters ?? [])
    .filter(filter => filter.selected.length > 0)
    .map(filter => ({
      key: filter.key,
      schema_key: filter.schema, // or filter.schema_key if available
      value: filter.selected,
    }));

  const SEARCH_URL = process.env.IP_SEARCH_URL as string;
  const body = {
    search: search ?? "",
    filters: formattedFilters,
  };

  const result = await TypedFetch.post(SEARCH_URL, body, {
    parser: SearchSoftwareResult,
    headers: { ...AuthorizationHeaders, Accept: 'application/json' },
  })  

  const softwares = await Promise.all(
    result.results.bindings.flatMap(b => result.head.vars.map(s => getSoftware(b[s].value)))
  )
  return softwares.filter(t => typeof t !== 'undefined') as SchemaSoftwareSourceCode[]
}

interface ConversionSpec {
  section: string;
  field: string;
  datatype: "int" | "float" | "bool";
}

const conversionSpecs: ConversionSpec[] = [
  { "section": "https://w3id.org/okn/o/sd#hasDimensionality", "field": "@value", "datatype": "int" },
  { "section": "http://schema.org/valueRequired", "field": "@value", "datatype": "bool" },
  { "section": "http://schema.org/isAccessibleForFree", "field": "@value", "datatype": "bool" },
  { "section": "http://schema.org/memoryRequirements", "field": "@value", "datatype": "int" },
  { "section": "https://imaging-plaza.epfl.ch/requiresGPU", "field": "@value", "datatype": "bool" }
];

function convertAndReplaceFields(results: any[], conversionSpecs: ConversionSpec[]): void {
  results.forEach((item: any) => {
    // console.log("###############")
    // console.log(item)
    conversionSpecs.forEach((spec: ConversionSpec) => {
      // Check if the item has the specified section and it is an array
      if (Array.isArray(item[spec.section])) {
        // Iterate over each element in the section array
        item[spec.section].forEach((subItem: any) => {
          // Check if the subItem has the specified field
          if (subItem[spec.field] !== undefined) {
            let value = subItem[spec.field];
            // Convert the value based on the specified datatype
            switch (spec.datatype) {
              case "int":
                subItem[spec.field] = parseInt(value);
                break;
              case "float":
                subItem[spec.field] = parseFloat(value);
                break;
              case "bool":
                subItem[spec.field] = value === "true";
                break;
            }
          }
        });
      }
    });
  });
}

export const getSoftware = async (repository: string, allowDraft: boolean = true) => {
  const query = getQuery(repository)
  const URLParams = new URLSearchParams({
    query,
  })
  try {
    const result = await TypedFetch.get(GET_URL + '?' + URLParams.toString(), {
      parser: RootTriplet.array(),
      headers: { ...AuthorizationHeaders, Accept: 'application/ld+json' },
    })

    convertAndReplaceFields(result, conversionSpecs);

    const mbSoftware = tripletsToSoftware(result)
    const parsingResult = SchemaSoftwareSourceCode.safeParse(mbSoftware)
    return parsingResult.success ? parsingResult.data : undefined
  } catch (e) {
    return undefined
  }
}


export const deleteSoftQuery = async (graph: string, repository: string) => `DELETE
#delete all "DIRECT" triples of chosen subject
{?s ?p ?o .
#delete all triples used by object of chosen subject
?o ?p2 ?o2. 
#delete all triples used by predicate of chosen subject
?p ?p3 ?o3.
#delete all triples used by object of object of chosen subject (2 layers deep)
?o2 ?p4 ?o4.
#delete all triples used by object of predicate of chosen subject (2 layers deep)
?p3 ?p5 ?o5.
}

WHERE {
   GRAPH <${graph}>
 {VALUES (?s) {(<${repository}>)}
 #Direct triples
       ?s ?p ?o.
 #triples used by object of chosen subject      
 optional {?o ?p2 ?o2.
          OPTIONAL {?o2 ?p4 ?o4}
          #unless object is used elsewhere          
          FILTER NOT EXISTS {?something ?uses ?o.
          FILTER (?something != ?s)}}
       
 #triples used by predicated of chosen subject      
 optional {?p ?p3 ?o3.
          OPTIONAL{?p3 ?p5 ?o5}
          #unless predicate is used elsewhere            
          FILTER NOT EXISTS {?X ?p ?Y. 
          FILTER (?X != ?s)}}
             
       }}`
// export const deleteSoftQuery = async (graph: string, repository: string) => `DELETE 
// {?s ?p ?o .
// ?o ?p2 ?o2. 
// ?p ?p3 ?o3.}
// WHERE {
// GRAPH <${graph}>
// {VALUES (?s) {(<${repository}>)}
// ?s ?p ?o.     
// optional{?o ?p2 ?o2.
// FILTER NOT EXISTS {?something ?uses ?o.
// FILTER (?something != ?s)}}    
// optional{?p ?p3 ?o3.          
// FILTER NOT EXISTS {?X ?p ?Y. 
// FILTER (?X != ?s)}}
// }}`


// // Define the interface for the expected response (adjust as needed)
// interface ApiResponse {
//   // Define the structure of your expected response here
//   message: string;
//   // ... other fields
// }

export const deleteSoftware = async (graph: string, repository: string) => {
  const query = await deleteSoftQuery(graph, repository);
  const encodedQuery = encodeURIComponent(query);
  const fullUrl = `${DELETE_URL}?update=${encodedQuery}`;
  // console.info(graph)
  // console.info(repository)
  // console.info(fullUrl)
  // console.info({...AuthorizationHeaders})

  try {
    const response = await fetch(fullUrl, {
      method: 'POST',
      headers: {
        ...AuthorizationHeaders,
        //'Accept': 'application/json'
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    // console.log(response)
    //const data = await response; //·.json();
    return response;
  } catch (error) {
    // Handle errors appropriately
    console.error("Error:", error);
    throw error;
  }
};

export const rebuildIndex = async () => {
  const POST_URL = `${process.env.IP_DB_URL}/rest/autocomplete/reindex`;

  try {
    const response = await fetch(POST_URL, {
      method: 'POST',
      headers: {
        ...AuthorizationHeaders,
      },
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    return response;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const makeKeywords = async () => {
  const POST_URL = `${process.env.IP_DB_URL}/repositories/imagingplaza/statements`;
  const query = `PREFIX schema: <http://schema.org/>
  INSERT {
      GRAPH <https://imaging-plaza.epfl.ch/finalGraph> 
      {
          ?s ?p ?o.
          ?s schema:keywords ?newO
      }
  } where {
      GRAPH <https://imaging-plaza.epfl.ch/finalGraph> {
          ?s ?p ?o .
         
          FILTER (?p = schema:name || ?p = schema:identifier)
          ?s a schema:SoftwareSourceCode
          BIND(str(lcase(?o)) as ?newO)
      } 
  }
  `;
  const encodedQuery = encodeURIComponent(query);
  const fullUrl = `${POST_URL}?update=${encodedQuery}`;
  console.info(fullUrl);

  try {
    const response = await fetch(fullUrl, {
      method: 'POST',
      headers: {
        ...AuthorizationHeaders,
      },
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
