import { Text, VStack, SimpleGrid } from '@chakra-ui/react'
import isEmpty from 'lodash/isEmpty'
import useTranslation from 'next-translate/useTranslation'
// import {useIsDesktop} from '../../../../hooks/useIsDesktop'
import { RunnableExample, SchemaSoftwareSourceCode } from '../../../Form/schema'
import { RunnableExampleRow } from './RunnableExampleRow'

interface Props {
  software: SchemaSoftwareSourceCode
}

const SoftwareRunnableExamples = ({ software }: Props) => {
  const { t } = useTranslation()


  return (
    <>
      {software['imag:runnableExample'] && !isEmpty(software['imag:runnableExample']) && (
        <VStack w='full' alignItems='flex-start' spacing={4}>
          <Text variant='semiBold'>{t('software:input_runnable_example_title')}</Text>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} w="full">
            {software['imag:runnableExample'].map((runnableExample: RunnableExample, idx) => (
              <RunnableExampleRow key={idx} runnableExample={runnableExample} />
            ))}
          </SimpleGrid>
        </VStack>
      )}
    </>
  )
}

export default SoftwareRunnableExamples