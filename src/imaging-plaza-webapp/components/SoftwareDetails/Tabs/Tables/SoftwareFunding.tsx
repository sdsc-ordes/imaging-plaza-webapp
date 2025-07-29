import { Box, HStack, Icon, Text, VStack, SimpleGrid } from '@chakra-ui/react'
import isEmpty from 'lodash/isEmpty'
import useTranslation from 'next-translate/useTranslation'
import { SchemaSoftwareSourceCode } from '../../../Form/schema'
import Users from '../../../Icons/light/Users.svg'
import Tag from '../../../Icons/light/Tag.svg'

interface Props {
  software: SchemaSoftwareSourceCode
}

const SoftwareFunding = ({ software }: Props) => {
  const { t } = useTranslation()

  // console.log("Has funding" + software["sd:hasFunding"])
  return (
    <>
      {software['sd:hasFunding'] && !isEmpty(software['sd:hasFunding']) && (
        <VStack w='full' alignItems='flex-start' spacing={4}>
          <Text variant='semiBold'>{t('software:authors_funding')}</Text>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} w="full">
            {software['sd:hasFunding'].map((funding, key) => {

              return (
                <Box
                  key={key}
                  py={4}
                  px={2}
                  borderWidth="1px"
                  borderRadius="md"
                  backgroundColor="brand.white"
                  h="full"
                >
                  <VStack spacing={6} align="start" h="full" justify="space-between">
                    <Text variant='semiBold' noOfLines={2}>{funding['sd:fundingSource']['schema:legalName']}</Text>
                    <VStack spacing={3} align="start">
                      <HStack spacing={4}>
                        {funding['sd:fundingGrant'] && (
                          <HStack spacing={1} >
                            <Icon as={Users} color="brand.primary" boxSize={3} />
                            <Text variant='regular' color="brand.grey" noOfLines={2}>{funding['sd:fundingGrant']}</Text>
                          </HStack>
                        )}

                        {funding['schema:identifier'] && (
                          <HStack spacing={1}>
                            <Icon as={Tag} color="brand.primary" boxSize={3} />
                            <Text variant='regular' color="brand.grey" noOfLines={2}>{funding['schema:identifier']}</Text>
                          </HStack>
                        )}
                      </HStack>
                    </VStack>

                  </VStack>
                </Box>
              );
            })}
          </SimpleGrid>
        </VStack>
      )}
    </>
  )
}
export default SoftwareFunding
