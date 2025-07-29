import { Text, VStack, SimpleGrid } from '@chakra-ui/react'
import isEmpty from 'lodash/isEmpty'
import useTranslation from 'next-translate/useTranslation'
import { Parameter, SchemaSoftwareSourceCode } from '../../../Form/schema'
import { ParameterRow } from './ParameterRow'

interface Props {
  software: SchemaSoftwareSourceCode
}

const SoftwareParameters = ({ software }: Props) => {
  const { t } = useTranslation()

  return (
    <>
      {software['sd:hasParameter'] && !isEmpty(software['sd:hasParameter']) && (
        <VStack w='full' alignItems='flex-start' spacing={4}>
          <Text variant='semiBold'>
            {t('software:input_parameters_title')}
          </Text>
          
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} w="full">
            {software['sd:hasParameter'].map((parameter: Parameter, idx) => (
              <ParameterRow key={idx} parameter={parameter} />
            ))}
          </SimpleGrid>
        </VStack>
      )}
    </>
  )
}

export default SoftwareParameters


