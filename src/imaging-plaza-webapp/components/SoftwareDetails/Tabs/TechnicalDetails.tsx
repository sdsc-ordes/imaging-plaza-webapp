import {Divider, VStack, Heading, SimpleGrid} from '@chakra-ui/react'

import useTranslation from 'next-translate/useTranslation'
// import {useIsDesktop} from '../../../hooks/useIsDesktop'
// import {ImageObjectTagEnum, SchemaSoftwareSourceCode} from '../../Form/schema'
import {SchemaSoftwareSourceCode} from '../../Form/schema'
// import Illustration from './Illustration'

import { KeywordItem } from './Components/KeywordItem'

interface Props {
  software: SchemaSoftwareSourceCode
}

const TechnicalDetails = ({software}: Props) => {
  const {t} = useTranslation()
 

  return (
    <VStack w='full' alignItems='flex-start' spacing={10}>

      <Heading variant='h5' color='brand.primary' mb={4}>
        {t('software:details_tab_technical_details')}
      </Heading>

      {/* Technical details in a grid */}
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} w="full">
        {/* Software requirements as Keys Items */}
        {software['schema:softwareRequirements'] && (
          <KeywordItem 
            title={t('software:technical_details_software_requirements')} 
            keywords={software['schema:softwareRequirements']} 
          />
        )}

        {/* Processor requirements */}
        {software['schema:processorRequirements'] && (
          <KeywordItem 
            title={t('software:technical_details_processor_requirements')} 
            keywords={software['schema:processorRequirements']} 
          />
        )}

        {software['schema:operatingSystem'] && (
          <KeywordItem 
            title={t('software:technical_details_operating_systems')} 
            keywords={software['schema:operatingSystem'].map(type => `${type}`)} 
          />
        )}


        {software['schema:programmingLanguage'] && (
          <KeywordItem 
          title={t('software:technical_details_programming_languages')} 
          keywords={software['schema:programmingLanguage'].map(type => `${type}`)} 
          />  
        )}

        {/* Image Modality */}
        {software['imag:imagingModality'] && (
          <KeywordItem 
          title={t('software:technical_details_image_modality')} 
          keywords={software['imag:imagingModality']} 
          />
        )}
      </SimpleGrid>

      {/* To check. Currently not available */}
      {/* {software['schema:memoryRequirements'] &&
        <TextItem
          title={t('software:technical_details_memory_requirements')}
          text={software['schema:memoryRequirements'] === 0 ? 'None' : software['schema:memoryRequirements'] + ' GB'}
        />
      } */}
      {/* To check. Currently not available */}
      {/* {software['imag:requiresGPU'] &&
        <TextItem
          title={t('software:technical_details_minimal_gpu_requirements')}
          text={software['imag:requiresGPU'].toString()}
        />
      } */}

      {/* To check. Currently not available */}
      {/* {software['schema:isAccessibleForFree'] &&
        <TextItem
          title={t('software:technical_details_accessible_to_free')}
          text={software['schema:isAccessibleForFree'] ? 'Yes' : 'No'}
        />
      } */}

      {/* {software['schema:conditionsOfAccess'] &&
        <TextItem
          title={t('software:technical_details_access_conditions')}
          text={software['schema:conditionsOfAccess']}
        />
      } */}

      {/* Documentation */}
      {/* {software['sd:hasDocumentation'] &&
        <LinkItem
          title={t('software:technical_details_documentation')}
          link={software['sd:hasDocumentation']}
          linkText={t('software:technical_details_documentation_linkText')}
        />
      } */}
      <Divider />
    </VStack>
  )
}
export default TechnicalDetails
