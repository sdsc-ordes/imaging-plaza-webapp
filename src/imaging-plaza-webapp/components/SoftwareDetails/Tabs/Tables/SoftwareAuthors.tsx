import { Text, VStack, SimpleGrid } from '@chakra-ui/react'
import isEmpty from 'lodash/isEmpty'
import useTranslation from 'next-translate/useTranslation'
import { SchemaSoftwareSourceCode } from '../../../Form/schema'
import { AuthorRow } from './AuthorRow'

interface Props {
  software: SchemaSoftwareSourceCode
}

const SoftwareAuthors = ({ software }: Props) => {
  const { t } = useTranslation()

  return (
    <>
      {software['schema:author'] && !isEmpty(software['schema:author']) && (
        <VStack w='full' alignItems='flex-start' spacing={4}>
          <Text variant='semiBold'>{t('software:authors_title')}</Text>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} w="full">
            {software['schema:author'].map((author, idx) => (
              <AuthorRow key={idx} author={author} />
            ))}
          </SimpleGrid>
        </VStack>
      )}
    </>
  )
}
export default SoftwareAuthors
