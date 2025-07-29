import {z, ZodRawShape} from 'zod'
import {Schemas} from '../../utils/schema-utils'
import {ImageObjectTagEnum, AffiliationEnum, ApplicationCategoryEnum, ImagingModalityEnum, IsPluginModuleOfEnum, OperatingSystemEnum, ProcessorRequirementsEnum, FeatureEnum, SoftwareRequirementsEnum, ComputerLanguageEnum, FairLevelEnum, HostTypeEnum } from './schema-consts'

/**
 * Here is the whole schema as described by Robin Franken
 * For the stuff related to parsing and other relations, check <rootDir>/utils/schema-utils
 */
const schemaPersonName = z.string()
const md4iOrcidId = z.string().url()
const newSchema = <T extends ZodRawShape>(type: string, shape: T) => {
  return z.object({
    ...shape,
    '@type': z.string().default(type),
  })
}

const schemaAffiliation = z.union([z.nativeEnum(AffiliationEnum), z.string()])
const schemaPerson = newSchema(Schemas.Person, {
  'schema:name': schemaPersonName,
  'md4i:orcidId': md4iOrcidId.optional(),
  'schema:affiliation': schemaAffiliation.array().optional(),
})

export type Person = z.infer<typeof schemaPerson>

const sdHasDimensionality = z.number().positive().int()
const schemaName = z.string().max(60)
const schemaEncodingFormat = z.string().url()
//.regex(/.*iana\.org\/assignments\/media-types\/.*/)
const sdHasFormat = z.string()
const schemaDefaultValue = z.string()
const schemaValueRequired = z.boolean()
const schemaDescription = z.string().max(2000)
const bioFormalParameter = newSchema(Schemas.FormalParameter, {
  'schema:description': schemaDescription,
  'schema:encodingFormat': schemaEncodingFormat.optional(),
  'schema:name': schemaName,
  'sd:hasDimensionality': sdHasDimensionality,
  'sd:hasFormat': sdHasFormat.optional(),
  'schema:defaultValue': schemaDefaultValue.optional(),
  'schema:valueRequired': schemaValueRequired.optional(),
})

export type Parameter = z.infer<typeof bioFormalParameter>

const schemaUrl = z.string().url()
const imagHasExecutableNotebook = newSchema(Schemas.ExecutableNotebook, {
  'schema:name': schemaName.optional(),
  'schema:description': schemaDescription.optional(),
  'schema:url': schemaUrl,
})
export type ExecutableNotebook = z.infer<typeof imagHasExecutableNotebook>

const schemaKeywords = z.nativeEnum(ImageObjectTagEnum)
const schemaImageObject = newSchema(Schemas.ImageObject, {
  'schema:keywords': schemaKeywords,
  'schema:contentUrl': z.string().regex(/^https:\/\//, "URL must start with 'https://'"),
})
const schemaLegalName = z.string()
const md4iHasRorId = z.string().url()
const schemaOrganization = newSchema(Schemas.Organization, {
  'schema:legalName': schemaLegalName,
  'md4i:hasRorId': md4iHasRorId.optional(),
})

export type Organization = z.infer<typeof schemaOrganization>

const schemaContentUrl = z.string().url()
const schemaMeasurementTechnique = z.string()
const schemaVariableMeasured = z.string()
const sphnBodySite = z.string()
const imagDatasetFormat = z.string()
const dmibHasPhysicalQuantity = z.string()
const imagResolution = z.string()
const imagImagingModality = z.union([z.nativeEnum(ImagingModalityEnum), z.string()])


const schemaDataFeed = newSchema(Schemas.DataFeed, {
  'schema:description': schemaDescription.optional(),
  'schema:contentUrl': schemaContentUrl.optional(),
  'schema:measurementTechnique': schemaMeasurementTechnique.optional(),
  'schema:name': schemaName,
  'schema:variableMeasured': schemaVariableMeasured.optional(),
  'imag:imagingModality': imagImagingModality.array().optional(),
  'sphn:bodySite': sphnBodySite.optional(),
  'imag:datasetFormat': imagDatasetFormat.optional(),
  'dmib:hasPhysicalQuantity': dmibHasPhysicalQuantity.optional(),
  'imag:resolution': imagResolution.optional(),
  'sd:hasDimensionality': sdHasDimensionality.optional()
})

export type DataFeed = z.infer<typeof schemaDataFeed>

const schemaIdentifier = z.string()
const sdFundingGrant = z.string()
const sdFundingSource = schemaOrganization
const sdFundingInformation = newSchema(Schemas.FundingInformation, {
  'schema:identifier': schemaIdentifier,
  'sd:fundingGrant': sdFundingGrant,
  'sd:fundingSource': sdFundingSource,
})
const sdHasFunding = sdFundingInformation
const sdAvailableInRegistry = z.string().url()
const schemaSoftwareVersion = z.string().regex(/[0-9]+\.[0-9]+\.[0-9]+/)
const sdSoftwareImage = newSchema(Schemas.SoftwareImage, {
  'schema:name': schemaName,
  'schema:description': schemaDescription,
  'schema:softwareVersion': schemaSoftwareVersion,
  'sd:availableInRegistry': sdAvailableInRegistry,
})
const sdHasSoftwareImage = sdSoftwareImage

export type SoftwareImage = z.infer<typeof sdHasSoftwareImage>

const schemaCitation = z.string().url().array()
const schemaMemoryRequirements = z.number().nonnegative().int()
const sdHasParameter = bioFormalParameter
const schemaApplicationCategory = z.union([z.nativeEnum(ApplicationCategoryEnum), z.string()])
const imagRelatedToOrganization = z.union([z.nativeEnum(AffiliationEnum), z.string()])
const schemaProcessorRequirements = z.nativeEnum(ProcessorRequirementsEnum)
const imagRequiresGPU = z.boolean()
const schemaCodeRepository = z.string().url()
const schemaConditionsOfAccess = z.string()
const schemaDateCreated = z.coerce.date()
const schemaDatePublished = z.coerce.date()
const schemaFeatureList = z.union([z.nativeEnum(FeatureEnum), z.string()])
const schemaImage = schemaImageObject
const schemaIsAccessibleForFree = z.boolean()
const schemaIsBasedOn = z.string().url()
const imagIsPluginModuleOf = z.union([z.nativeEnum(IsPluginModuleOfEnum), z.string()])
const schemaLicense = z.string().regex(/spdx\.org.*/) //spdx url should be written to this prop when picking license from picklist widget
const schemaAuthor = z.union([schemaPerson, schemaOrganization])
const schemaOperatingSystem = z.nativeEnum(OperatingSystemEnum)
const schemaProgrammingLanguage = z.union([z.nativeEnum(ComputerLanguageEnum), z.string()])
const schemaSoftwareRequirements = z.union([z.nativeEnum(SoftwareRequirementsEnum), z.string()])

const sdHasAcknowledgements = z.string()
const sdHasDocumentation = z.string().url()
const sdHasExecutableInstructions = z.string()
// const imagHasExecutableNotebook = z.string().url().array()
const sdReadme = z.string().url()

// const imagHostType = z.union([z.nativeEnum(HostTypeEnum), z.string()])
const imagHostType = z.nativeEnum(HostTypeEnum)

const imagRunnableExample = newSchema(Schemas.RunnableExample, {
  'schema:name': schemaName,
  'schema:description': schemaDescription,
  'schema:url': schemaUrl,
  'imag:hostType': imagHostType,
})
export type RunnableExample = z.infer<typeof imagRunnableExample>

// #MODIFY_SCHEMA_1 change the schema
export const SchemaSoftwareSourceCode = newSchema('schema:SoftwareSourceCode', {
  'schema:applicationCategory': schemaApplicationCategory.array().optional(),
  'schema:citation': schemaCitation,
  'schema:codeRepository': schemaCodeRepository.array(),
  'schema:conditionsOfAccess': schemaConditionsOfAccess.optional(),
  'schema:dateCreated': schemaDateCreated,
  'schema:datePublished': schemaDatePublished,
  'schema:description': schemaDescription,
  'schema:featureList': schemaFeatureList.array().optional(),
  'schema:image': schemaImage.array(),
  'schema:isAccessibleForFree': schemaIsAccessibleForFree.optional(),
  'schema:isBasedOn': schemaIsBasedOn.optional(),
  'imag:isPluginModuleOf': imagIsPluginModuleOf.array().optional(),
  'schema:license': schemaLicense,
  'schema:author': schemaAuthor.array(),
  'imag:relatedToOrganization': imagRelatedToOrganization.array().optional(),
  'schema:name': schemaName,
  'schema:operatingSystem': schemaOperatingSystem.array().optional(),
  'schema:programmingLanguage': schemaProgrammingLanguage.array().optional(),
  'schema:softwareRequirements': schemaSoftwareRequirements.array().optional(),
  'schema:processorRequirements': schemaProcessorRequirements.array().optional(),
  'schema:memoryRequirements': schemaMemoryRequirements.optional(),
  'imag:requiresGPU': imagRequiresGPU.optional(),
  'schema:supportingData': schemaDataFeed.array().optional(),
  'schema:url': schemaUrl,
  'schema:identifier': schemaIdentifier,
  'sd:hasAcknowledgements': sdHasAcknowledgements.optional(),
  'sd:hasDocumentation': sdHasDocumentation.optional(),
  'sd:hasExecutableInstructions': sdHasExecutableInstructions.optional(),
  'imag:hasExecutableNotebook': imagHasExecutableNotebook.array().optional(),
  'imag:runnableExample': imagRunnableExample.array().optional(),


  'sd:hasParameter': sdHasParameter.array().optional(),
  'sd:readme': sdReadme.optional(),
  'sd:hasFunding': sdHasFunding.array().optional(),
  'sd:hasSoftwareImage': sdHasSoftwareImage.array().optional(),
  'imag:imagingModality': imagImagingModality.array().optional(),
  'imag:fairLevel': z.string().optional(),
  'imag:graph': z.string().optional(),
})

// Filter Types for Filtering the Search
export const FilterSchema = z.object({
  title: z.string(),
  key: z.string(),
  values: z.array(z.string()),
  selected: z.array(z.string()),
  schema: z.string(),
});
export type Filter = z.infer<typeof FilterSchema>;
export const defaultFilters: Filter[] = [
  { title: 'Programming Language', key: 'programmingLanguage', values: Object.values(ComputerLanguageEnum), selected : [], schema: 'schema:programmingLanguage',  },
  { title: 'Operating System', key: 'operatingSystem', values: Object.values(OperatingSystemEnum), selected : [], schema: 'schema:operatingSystem' },
  { title: 'Imaging Modality', key: 'imagingModality', values: Object.values(ImagingModalityEnum), selected : [], schema: 'imag:imagingModality'},
  { title: 'Fair Level', key: 'fairLevel', values: Object.values(FairLevelEnum), selected : [], schema: 'schema:featureList'},
  // { title: 'Feature List', key: 'featureList', values: Object.values(FeatureEnum), selected : [], schema: 'schema:featureList'},
];

export type SchemaSoftwareSourceCode = z.infer<typeof SchemaSoftwareSourceCode>
export {ImageObjectTagEnum, AffiliationEnum, ApplicationCategoryEnum, ImagingModalityEnum, IsPluginModuleOfEnum, OperatingSystemEnum, ProcessorRequirementsEnum, FeatureEnum, SoftwareRequirementsEnum, ComputerLanguageEnum}
export {schemaAuthor, schemaPerson, schemaOrganization}
