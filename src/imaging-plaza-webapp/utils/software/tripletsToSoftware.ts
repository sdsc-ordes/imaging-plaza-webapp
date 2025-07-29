import {groupById, mapKeys, omit, unique} from '@coteries/utils'
import {z, ZodEnum, ZodType} from 'zod'
import {SchemaSoftwareSourceCode} from '../../components/Form/schema' 
import {LeafTriplet, RootTriplet} from '../../models/Triplet'
import {Schemas, contextualize} from '../schema-utils'
import {isZodArray, isZodEnum, isZodOptional} from '../zod-utils'
//import { convertSPToMultipleSelectObject } from './formHelper'

const schemaKeys = new Set(Object.keys(SchemaSoftwareSourceCode.keyof().Values))
const SchemasValues = new Set(Object.values(Schemas)) as Set<string>

const getFieldType = (key: string): ZodType<any> => {
  const field = SchemaSoftwareSourceCode._def.shape()[key as keyof SchemaSoftwareSourceCode]
  return isZodOptional(field) ? field._def.innerType : field
}

const unwrapTriplet = (triplet: RootTriplet): any => {
  return {
    ...triplet,
    ...Object.entries(omit(triplet, '@id', '@type')).reduce(
      (acc, [k, v]) => {
        if (!Array.isArray(v)) {
          return { ...acc, [k]: v };
        }

        if (k === 'imag:imagingModality') {
          const modalityStrings = v
            .map(entry => entry['@id'] ?? entry['@value'])
            .filter(Boolean);
          return { ...acc, [k]: modalityStrings };
        }

        const unwrapped = v[0]?.['@id'] ?? v[0]?.['@value'] ?? '';

        return {
          ...acc,
          [k]: unwrapped,
        };
      },
      {}
    ),
    '@type': triplet['@type']?.map(contextualize).find(t => SchemasValues.has(t)) ?? '',
  };
};

const unwrapValues = (type: string, value: (RootTriplet | string)[]): any => {
  const field = getFieldType(type)
  const isTriplet = typeof value[0] === 'object'

  const isArray = isZodArray(field)
  const finalType = isArray ? field._def.type : field

  const finalValues = isZodEnum(finalType)
    ? value.filter(v =>
        isTriplet
          ? v
          : Object.values((finalType as unknown as ZodEnum<any>)._def.values).includes(v)
      )
    : value
        .map(v => (isTriplet ? unwrapTriplet(v as RootTriplet) : v))
        .filter(t => t['@type'] !== '')
  const parsed = finalValues.reduce((acc, f) => {
    const result = finalType.safeParse(f)

    if (result.success) {
      return [...acc, result.data]
    } else {
      return acc
    }
  }, [])

  return isArray ? unique(parsed, JSON.stringify) : parsed[0]
}

function convertValuesToString(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(item => {
      if (typeof item === 'object' && item !== null && '@value' in item) {
        return String(item['@value']);
      } else {
        return convertValuesToString(item);
      }
    }).join(', ');
  } else if (typeof obj === 'object' && obj !== null) {
    for (let key in obj) {
      if (key === '@type' && obj[key] === 'https://w3id.org/okn/o/sd#FundingInformation') {
        obj[key] = 'sd:FundingInformation';
      } else {
        obj[key] = convertValuesToString(obj[key]);
      }
    }
    return obj;
  } else {
    return String(obj);
  }
}

export const tripletsToSoftware = (triplets: RootTriplet[]) => {
  const result = triplets 
  const resultObject = groupById(triplets, '@id')
  const ssc = result.find(t => t['@type']!.find(t => t.includes('SoftwareSourceCode')))!
  const allKeys = Object.keys(resultObject)
  const fullSchema = Object.entries(omit(ssc, '@id', '@type')).reduce(
    (acc, [k, v]) => ({
      ...acc,
      [contextualize(k)]: v,
    }),
    {} as RootTriplet
  )
  const props = Object.keys(fullSchema)
  const keepProps = props.filter(p => schemaKeys.has(p))
  const soft = keepProps.reduce((acc, k) => {

    const valueInSSC = fullSchema[k] as LeafTriplet[]
    interface Schema {
      [key: string]: string | undefined;
    }

    const value = valueInSSC
      .map((schema: Schema) => {
        const v = schema['@id'] ?? schema['@value'] ?? undefined
        if (k === 'schema:author' && String(resultObject[String(v)]['@type'][0]) === 'http://schema.org/Person' && typeof v === 'string') {
          
            const obj: { [key: string]: any } = {};


            if (resultObject[v]['http://schema.org/name'] && resultObject[v]['http://schema.org/name'][0]['@value']) {
              obj['schema:name'] = resultObject[v]['http://schema.org/name'][0]['@value'];
            }
            
            if (resultObject[v]['http://w3id.org/nfdi4ing/metadata4ing#orcidId'] && resultObject[v]['http://w3id.org/nfdi4ing/metadata4ing#orcidId'][0]['@value']) {
              obj['md4i:orcidId'] = resultObject[v]['http://w3id.org/nfdi4ing/metadata4ing#orcidId'][0]['@value'];
            }
            
            if (resultObject[v]['http://schema.org/affiliation'] && resultObject[v]['http://schema.org/affiliation'][0]['@value']) {
              obj['schema:affiliation'] = [resultObject[v]['http://schema.org/affiliation'][0]['@value']];
            }
          return obj
        }

        // Just leaving Organization with a placeholder
        if (k === 'schema:author' && String(resultObject[String(v)]['@type'][0]) === 'http://schema.org/Organization' && typeof v === 'string') {

        const obj: { [key: string]: any } = {};

        if (resultObject[v]['http://schema.org/legalName'] && resultObject[v]['http://schema.org/legalName'][0]['@value']) {
          obj['schema:legalName'] = resultObject[v]['http://schema.org/legalName'][0]['@value'];
        }

        if (resultObject[v]['http://w3id.org/nfdi4ing/metadata4ing#hasRorId'] && resultObject[v]['http://w3id.org/nfdi4ing/metadata4ing#hasRorId'][0]['@value']) {
          obj['md4i:hasRorId'] = resultObject[v]['http://w3id.org/nfdi4ing/metadata4ing#hasRorId'][0]['@value'];
        }
          return obj
        }

        //Blank nodes 
        if (typeof v === 'string' && v?.startsWith('_:genid-') && allKeys.includes(v)) {
          const obj = resultObject[v] as RootTriplet

          if (k === 'sd:hasFunding') {
            const fundSourceKey = obj?.["https://w3id.org/okn/o/sd#fundingSource"]?.[0]?.["@id"]
            const fundObj = fundSourceKey ? resultObject[fundSourceKey] : undefined
            obj["https://w3id.org/okn/o/sd#fundingSource"] = fundObj ? fundObj as unknown as { '@value'?: string | undefined; '@id'?: string | undefined; }[] : [] as { '@value'?: string | undefined; '@id'?: string | undefined; }[];
          }

          if (k === 'schema:supportingData'){
            const obj = resultObject[v] as RootTriplet

            const imagingObjs = obj?.['https://imaging-plaza.epfl.ch/ontology#imagingModality'] as { '@value'?: string }[] | undefined;
            const modalityStrings = imagingObjs?.map(im => im['@value']).filter(Boolean) ?? [];
            obj['https://imaging-plaza.epfl.ch/ontology#imagingModality'] = modalityStrings.map(str => ({ '@value': str }));

          }  
          
          return mapKeys(obj, contextualize) as RootTriplet
        } else return v
      })
      .filter(k => typeof k !== 'undefined') as (RootTriplet | string)[]

    // console.log( value)
    let tempUnwrappedValue
    if (k === 'schema:author') {
      tempUnwrappedValue = value
    }
    else {
      // Giving error when parsing author
      tempUnwrappedValue = unwrapValues(k, value)
    }

    if (k === 'sd:hasFunding') {
      
      interface FundingSource {
        [key: string]: {
          [key: string]: string;
        } | null;
      }

      const updatedValue = value.map(v => {
        if (typeof v === 'object' && v !== null) {
          if (v["sd:fundingSource"] && typeof v["sd:fundingSource"] === 'object' && v["sd:fundingSource"] !== null) {
            const vAsFundingSource: FundingSource = v as any;
            if (vAsFundingSource["sd:fundingSource"] && vAsFundingSource["sd:fundingSource"]["http://schema.org/legalName"]) {
              vAsFundingSource["sd:fundingSource"]["schema:legalName"] = vAsFundingSource["sd:fundingSource"]["http://schema.org/legalName"] as string;
              delete vAsFundingSource["sd:fundingSource"]["http://schema.org/legalName"];
            }
            if (vAsFundingSource["sd:fundingSource"] && vAsFundingSource["sd:fundingSource"]["http://w3id.org/nfdi4ing/metadata4ing#hasRorId"]) {
              vAsFundingSource["sd:fundingSource"]["md4i:hasRorId"] = vAsFundingSource["sd:fundingSource"]["http://w3id.org/nfdi4ing/metadata4ing#hasRorId"] as string;
              delete vAsFundingSource["sd:fundingSource"]["http://w3id.org/nfdi4ing/metadata4ing#hasRorId"];
            }
          }
        }
        return v;
      });


      updatedValue.map(convertValuesToString)

      tempUnwrappedValue = updatedValue 
    } 

    const unwrappedValue = tempUnwrappedValue
    return {
      ...acc,
      [k]: unwrappedValue,
    }
  }, {} as Partial<SchemaSoftwareSourceCode>)

  // Validate the object against the partial schema
  const PartialSchemaSoftwareSourceCode = SchemaSoftwareSourceCode.partial();

  try {
    PartialSchemaSoftwareSourceCode.parse(soft);
    // console.log('soft is a valid Partial<SchemaSoftwareSourceCode>');
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Validation error:', JSON.stringify(error, null, 2));
      (error as z.ZodError).errors.forEach(err => {
        console.error('Error path:', err.path);
      });
    } else {
      console.error('Unexpected error:', error);
    }
  }

  return soft
}
