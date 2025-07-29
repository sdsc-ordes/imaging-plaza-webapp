import { Text, VStack, SimpleGrid } from '@chakra-ui/react'
import isEmpty from 'lodash/isEmpty'
import useTranslation from 'next-translate/useTranslation'
// import {useIsDesktop} from '../../../../hooks/useIsDesktop'
import { ExecutableNotebook, SchemaSoftwareSourceCode } from '../../../Form/schema'
import { ExecutableNotebookRow } from './ExecutableNotebookRow'

interface Props {
  software: SchemaSoftwareSourceCode
}

const SoftwareExecutableNotebooks = ({ software }: Props) => {
  const { t } = useTranslation()
  // const isDesktop = useIsDesktop()

  // console.log(software)

  return (
    <>
      {software['imag:hasExecutableNotebook'] && !isEmpty(software['imag:hasExecutableNotebook']) && (
        <VStack w='full' alignItems='flex-start' spacing={4}>
          <Text variant='semiBold'>{t('software:input_executableNotebook_title')}</Text>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} w="full">
            {software['imag:hasExecutableNotebook'].map((executableNotebook: ExecutableNotebook, idx) => (
              <ExecutableNotebookRow key={idx} executableNotebook={executableNotebook} />
            ))}
          </SimpleGrid>
        </VStack>
      )}
    </>
  )
}

export default SoftwareExecutableNotebooks