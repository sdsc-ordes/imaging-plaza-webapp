import {HStack, Link, Text, useTheme, VStack} from '@chakra-ui/react'
import useTranslation from 'next-translate/useTranslation'
import {useMemo} from 'react'
import {Schemas} from '../../../utils/schema-utils'
import {SchemaSoftwareSourceCode} from '../../Form/schema'
import Users from '../../Icons/light/Users.svg'
import ExternalLink from '../../Icons/regular/ExternalLink.svg'
import InformationLine from './InformationLine'

interface Props {
  software: SchemaSoftwareSourceCode
  noTags?: boolean
}

/**
 * Author line
 */
const AuthorInfoLine = ({software, noTags}: Props) => {
  const theme = useTheme()

  const {t} = useTranslation()

  const softwareAuthors = useMemo(() => {
    const orgs = software['schema:author']?.filter(p => p['@type'] === Schemas.Organization)
    if (orgs && orgs.length > 0) {
      return orgs.map(author => (author as any)['schema:legalName']).join(', ')
    } else {
      return software['schema:url']
    }
  }, [software])

  return (
    <HStack justify='space-between' w='full' mb={5}>
      <HStack>
        <InformationLine icon={<Users height={20} width={20} />}>
          <VStack spacing={0} alignItems='flex-start'>
            <Text color={theme.colors.brand.grey} variant='small'>
              {t('software:developed_by')}
            </Text>
            {software['schema:url'] ? (
              <Link
                isExternal
                href={software['schema:url'] ?? ''}
                _hover={{color: theme.colors.brand.primary}}>
                <Text variant='semiBold' as='span'>
                  {softwareAuthors}{' '}
                  <ExternalLink width={12} height={12} style={{display: 'inline'}} />
                </Text>
              </Link>
            ) : (
              <Link
                isExternal
                href={software['schema:url'] ?? ''}
                _hover={{color: theme.colors.brand.primary}}>
                <Text variant='semiBold'>{softwareAuthors}</Text>
              </Link>
            )}
          </VStack>
        </InformationLine>
      </HStack>
      {software['imag:requiresGPU'] && !noTags && (
        <Text variant='tag'>{t('software:gpu_label')}</Text>
      )}
    </HStack>
  )
}

export default AuthorInfoLine
