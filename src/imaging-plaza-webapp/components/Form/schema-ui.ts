import {FormSchema} from '../AutoForm'
import {SchemaSoftwareSourceCode} from './schema'

/**
 * descriptor for splitting the schema into several forms
 */
// #MODIFY_SCHEMA_2 add the property to a form
export const schemaDescriptor: FormSchema<SchemaSoftwareSourceCode> = {
  descriptors: {
    general: {
      sections: {
        general: {
          title: 'General',
          description: 'Basic information about the software',
          fields: [
            'schema:name',
            'schema:description',
            'schema:codeRepository',
            'schema:url',
            'schema:dateCreated',
            'schema:datePublished',
            'schema:featureList',
            'schema:image',
            'schema:license',
            'schema:citation',
            'imag:relatedToOrganization',
            'schema:author',
          ],
        },
      },
    },
    overview: {
      sections: {
        title: 'Overview',
        fields: ['schema:applicationCategory', 'schema:isBasedOn', 'imag:isPluginModuleOf'],
      },
    },
    io: {
      sections: {
        title: 'Input, Processing & Output',
        description: 'What is needed to run the software',
        fields: [
          'sd:readme',
          'sd:hasExecutableInstructions',
          'imag:runnableExample',
          'imag:hasExecutableNotebook',
          'sd:hasParameter',
          'sd:hasSoftwareImage',
          'schema:supportingData',
        ],
      },
    },
    technicals: {
      sections: {
        title: 'Technical details',
        description: "Details about the software's internals and technical requirements",
        fields: [
          'schema:softwareRequirements',
          'schema:processorRequirements',
          'schema:memoryRequirements',
          'schema:operatingSystem',
          'schema:programmingLanguage',
          'imag:imagingModality',
          'imag:requiresGPU',
          'schema:isAccessibleForFree',
          'schema:conditionsOfAccess',
          'sd:hasDocumentation',
        ],
      },
    },
    impact: {
      sections: {
        title: 'Impact',
        description: "Details about the software's funding and acknowledgements",
        fields: ['sd:hasFunding', 'sd:hasAcknowledgements'],
      },
    },
  },
}
