import { Box, Text, VStack, Link, HStack, Icon, Button } from '@chakra-ui/react'
import { validate } from '@coteries/utils'
import { Schemas } from '../../../../utils/schema-utils'
import { ExecutableNotebook } from '../../../Form/schema'
import ExternalLink from '../../../Icons/regular/ExternalLink.svg'
import useTranslation from 'next-translate/useTranslation'


const isExecutableNotebook = validate<ExecutableNotebook>(obj => obj['@type'] === Schemas.ExecutableNotebook)

const RowExecutableNotebook = ({ executableNotebook }: { executableNotebook: ExecutableNotebook }) => {
  const { t } = useTranslation()

  return (
    <Link
      href={executableNotebook['schema:url']}
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
          <Text variant='semiBold'>{executableNotebook['schema:name']}</Text>
          <HStack spacing={1} >
            <Text variant='regular' color="brand.grey">{executableNotebook['schema:description']}</Text>
          </HStack>
        </VStack>
        <HStack spacing={1}>
          <Button variant='link' color="brand.primary">
            {t('software:details_see_executable_notebook')}
          </Button>
          <Icon as={ExternalLink} color="brand.primary" boxSize={3} />
        </HStack>
      </VStack>
    </Box>
    </Link>
  )
}

export const ExecutableNotebookRow = ({ executableNotebook }: { executableNotebook: ExecutableNotebook }) => {
  if (isExecutableNotebook(executableNotebook)) return <RowExecutableNotebook executableNotebook={executableNotebook} />
  else return null
}
