import { Box, Text, VStack, HStack, Icon, Link, Button } from '@chakra-ui/react'
import { validate } from '@coteries/utils'
import { Schemas } from '../../../../utils/schema-utils'
import { Organization, Person } from '../../../Form/schema'
import User from '../../../Icons/regular/User.svg'
import Globe from '../../../Icons/regular/Globe.svg'
import ExternalLink from '../../../Icons/regular/ExternalLink.svg'
import useTranslation from 'next-translate/useTranslation'

const isPerson = validate<Person>(obj => obj['@type'] === Schemas.Person)
const isOrganization = validate<Organization>(obj => obj['@type'] === Schemas.Organization)

const RowPerson = ({ person }: { person: Person }) => {
  const { t } = useTranslation()
  
  return (
    <Link href={person['md4i:orcidId']} isExternal display="block" w="100%" _hover={{ textDecoration: 'none' }}>
      <Box
        py={4}
        px={2}
        borderWidth="1px"
        borderRadius="md"
        backgroundColor="brand.white"
        transition="all 0.2s"
        h="full"
        _hover={{
          boxShadow: 'md',
        }}
      >
        <VStack spacing={6} align="start" h="full" justify="space-between">
          <VStack spacing={3} align="start">
            <HStack spacing={1}>
              <Icon as={User} color="brand.primary" boxSize={3} />
              <Text variant='semiBold'>{person['schema:name']}</Text>
            </HStack>
            {person['schema:affiliation'] && (
              <HStack spacing={1}>
                <Icon as={Globe} color="brand.primary" boxSize={3} />
                <Text variant='regular' color="brand.grey">{person['schema:affiliation']}</Text>
              </HStack>
            )}
          </VStack>
          {person['md4i:orcidId'] && (
            <HStack spacing={1}>
              <Button variant='link' color="brand.primary">
                {t('software:authors_orcid')}
              </Button>
              <Icon as={ExternalLink} color="brand.primary" boxSize={3} />
            </HStack>
          )}
        </VStack>
      </Box>
    </Link>
  )
}

const RowOrganization = ({ org }: { org: Organization }) => {
  const { t } = useTranslation()
  
  return (
    <Link href={org['md4i:hasRorId']} isExternal display="block" w="100%" _hover={{ textDecoration: 'none' }}>
      <Box
        py={4}
        px={2}
        borderWidth="1px"
        borderRadius="md"
        backgroundColor="brand.white"
        transition="all 0.2s"
        h="full"
        _hover={{
          boxShadow: 'md',
        }}
      >
        <VStack spacing={6} align="start" h="full" justify="space-between">
          <VStack spacing={3} align="start">
            <HStack spacing={1}>
              <Icon as={Globe} color="brand.primary" boxSize={3} />
              <Text variant='semiBold'>{org['schema:legalName']}</Text>
            </HStack>
          </VStack>
          {org['md4i:hasRorId'] && (
            <HStack spacing={1}>
              <Button variant='link' color="brand.primary">
                {t('software:details_see_organization_profile')}
              </Button>
              <Icon as={ExternalLink} color="brand.primary" boxSize={3} />
            </HStack>
          )}
        </VStack>
      </Box>
    </Link>
  )
}

export const AuthorRow = ({ author }: { author: Person | Organization }) => {
  if (isPerson(author)) return <RowPerson person={author} />
  else if (isOrganization(author)) return <RowOrganization org={author} />
  else return null
}
