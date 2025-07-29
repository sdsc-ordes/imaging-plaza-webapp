import { Box, Text, VStack, Link, HStack, Icon, Button } from '@chakra-ui/react'
import { validate } from '@coteries/utils'
import { Schemas } from '../../../../utils/schema-utils'
import { RunnableExample } from '../../../Form/schema'
import ExternalLink from '../../../Icons/regular/ExternalLink.svg'
import useTranslation from 'next-translate/useTranslation'


const isRunnableExample = validate<RunnableExample>(obj => obj['@type'] === Schemas.RunnableExample)

const RowRunnableExample = ({ runnableExample }: { runnableExample: RunnableExample }) => {
  const { t } = useTranslation()

  return (
    <Link
      href={runnableExample['schema:url']}
      isExternal
      display="block"
      w="100%"
      _hover={{ textDecoration: 'none' }}
  >

    <Box
      py={4}
      px={2}
      borderWidth="1px"
      borderRadius="md"
      backgroundColor="brand.white"
      h="full"
      transition="all 0.2s"
      _hover={{
        boxShadow: 'md',
      }}
    >
      <VStack spacing={6} align="start" justify="space-between">
        <VStack spacing={3} align="start">
          <Text variant='semiBold'>{runnableExample['schema:name']}</Text>
          <HStack spacing={1} >
            <Text variant='regular' color="brand.grey">{runnableExample['schema:description']}</Text>
          </HStack>
        </VStack>
        <HStack spacing={1}>
          <Button variant='link' color="brand.primary">
                {t('software:details_see_runnable_example')}
          </Button>
          <Icon as={ExternalLink} color="brand.primary" boxSize={3} />
        </HStack>
      </VStack>
    </Box>
    </Link>
  )
}

export const RunnableExampleRow = ({ runnableExample }: { runnableExample: RunnableExample }) => {
  if (isRunnableExample(runnableExample)) return <RowRunnableExample runnableExample={runnableExample} />
  else return null
}
