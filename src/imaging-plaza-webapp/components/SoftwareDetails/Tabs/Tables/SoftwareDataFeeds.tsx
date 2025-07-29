import { Text, VStack, SimpleGrid} from '@chakra-ui/react'
import useTranslation from 'next-translate/useTranslation'
import { isEmpty } from 'lodash'
import { DataFeed, SchemaSoftwareSourceCode } from '../../../Form/schema'
import { DataFeedRow } from './DataFeedRow'

interface Props {
  software: SchemaSoftwareSourceCode
}



const SoftwareDataFeeds = ({ software }: Props) => {
  console.log(software)
  const { t } = useTranslation()

  return (
    <>
      {software['schema:supportingData'] && !isEmpty(software['schema:supportingData']) && (
        <VStack w='full' alignItems='flex-start' spacing={4}>
          <Text variant='semiBold'>
            {t('software:input_dataFeed_title')}
          </Text>
          
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} w="full">
            {software['schema:supportingData']
              .filter((datafeed): datafeed is DataFeed => datafeed !== undefined)
              .map((datafeed: DataFeed, idx) => (
                <DataFeedRow key={idx} dataFeed={datafeed} />
              ))}
          </SimpleGrid>
        </VStack>
      )}
    </>
  )
}

export default SoftwareDataFeeds