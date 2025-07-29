import { Text, VStack, SimpleGrid } from '@chakra-ui/react'
import isEmpty from 'lodash/isEmpty'
import useTranslation from 'next-translate/useTranslation'
import { SoftwareImage, SchemaSoftwareSourceCode } from '../../../Form/schema'
import { ImageRow } from './ImageRow'

interface Props {
  software: SchemaSoftwareSourceCode
}

const SoftwareImages = ({ software }: Props) => {
  const { t } = useTranslation()

  // console.log(software)

  return (
    <>
      {software['sd:hasSoftwareImage'] && !isEmpty(software['sd:hasSoftwareImage']) && (
        <VStack w='full' alignItems='flex-start' spacing={4}>
          <Text variant='semiBold'>{t('software:input_image_title')}</Text>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} w="full">
            {software['sd:hasSoftwareImage'].map((image: SoftwareImage, idx) => (
              <ImageRow key={idx} image={image} />
            ))}
          </SimpleGrid>
        </VStack>
      )}
    </>
  )
}

export default SoftwareImages


