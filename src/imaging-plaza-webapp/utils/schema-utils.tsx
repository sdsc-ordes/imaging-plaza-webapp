import {ZodDefault, ZodObject, ZodRawShape, ZodString} from 'zod'
import {type SchemaSoftwareSourceCode} from '../components/Form/schema'
import {ImageObjectTagEnum} from '../components/Form/schema-consts'

const TEMP_GRAPH = 'https://imaging-plaza.epfl.ch/temporaryGraph'

export type TypedZodShape = ZodRawShape & {
  '@type': ZodDefault<ZodString>
}

/**
 * Context to parse back and forth when consuming json-ld
 */
export const Context = {
  schema: 'http://schema.org/',
  sd: 'https://w3id.org/okn/o/sd#',
  md4i: 'http://w3id.org/nfdi4ing/metadata4ing#',
  imag: 'https://imaging-plaza.epfl.ch/ontology#',
  bio: 'https://bioschemas.org/',
  spe: 'https://openschemas.github.io/spec-container/specifications/',
  rdfs: 'http://www.w3.org/2000/01/rdf-schema#',
  xsd: 'http://www.w3.org/2001/XMLSchema#',
  sh: 'http://www.w3.org/ns/shacl#',
  owl: 'http://www.w3.org/2002/07/owl#',
  dmib: 'https://biomedit.ch/rdf/sphn-schema/dmib#', 
  sphn: 'https://biomedit.ch/rdf/sphn-schema/sphn#'
}

/**
 * All the different complex schemas
 */
export enum Schemas {
  Person = 'schema:Person',
  FormalParameter = 'bio:FormalParameter',
  ImageObject = 'schema:ImageObject',
  Organization = 'schema:Organization',
  DataFeed = 'schema:DataFeed',
  Grant = 'schema:Grant',
  FundingInformation = 'sd:FundingInformation',
  SoftwareImage = 'sd:SoftwareImage',
  ExecutableNotebook = 'imag:ExecutableNotebook',
  RunnableExample = 'imag:RunnableExample',
}

/**
 * Returns the object type
 * @param fieldType field zod descriptor
 * @returns the type of the field
 */
export const getObjectType = (fieldType: ZodObject<TypedZodShape>): string => {
  return fieldType._def.shape()['@type'].parse(undefined)
}

/**
 * Check if the software is a draft or not
 * @param s the software
 * @returns true if is draft
 */
export const isDraft = (s: SchemaSoftwareSourceCode) => {
  return !s['imag:graph'] || s['imag:graph'] === TEMP_GRAPH
}

/**
 * Adds the full context to the key (replace http://schema.org/ with schema:)
 * @param k the key to contextualize
 * @returns the contextualized key
 */
export const contextualize = (k: string): string => {
  return Object.entries(Context).reduce(
    (acc, [k, url]) => (acc.startsWith(url) ? acc.replace(url, k + ':') : acc),
    k
  )
}

/**
 * add context to payload of the schema to post it to sparql
 * @param p the software
 * @returns
 */
export const addContext = (p: Partial<SchemaSoftwareSourceCode>) => ({
  ...p,
  '@type': ['http://schema.org/SoftwareSourceCode'],
  '@context': Context,
  '@id': p['schema:codeRepository']?.[0] ?? p['schema:identifier'] ?? '',
})

/**
 * gets fair level as a number
 * @param schema the software
 * @returns the fair level
 */
export const getFairLevel = (schema: SchemaSoftwareSourceCode) => {
  return schema['imag:fairLevel'] ? parseInt(schema['imag:fairLevel'].replaceAll(/[^\d]/g, '')) : 0
}

/**
 *
 * @param type the raw type as in the schema
 * @returns the type without its schema
 */
export const getTypeName = (type: string) => {
  const arr = type.split(/:/)
  return arr.length === 2 ? arr[1] : type
}

/**
 * get the most likely image for a software
 * @param software the software
 * @returns the software
 */
export const getImage = (software: SchemaSoftwareSourceCode) => {
  if (!software['schema:image'] || software['schema:image'].length === 0) return []
  else {
    const base = software['schema:image'].filter(
      i => i['schema:keywords'] === ImageObjectTagEnum.IllustrativeImage
    )
    if (base.length === 0) return [software['schema:image'][0]]
    else return base
  }
}
