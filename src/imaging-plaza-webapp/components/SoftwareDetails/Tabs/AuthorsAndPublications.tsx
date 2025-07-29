import { HStack, Link, Text, useTheme, VStack, Heading } from '@chakra-ui/react'
import isEmpty from 'lodash/isEmpty'
import useTranslation from 'next-translate/useTranslation'
import { SoftwareLinks } from '../DetailsGrid'
import { SchemaSoftwareSourceCode } from '../../Form/schema'
import QuoteRight from '../../Icons/solid/QuoteRight.svg'
import SoftwareFunding from './Tables/SoftwareFunding'
import SoftwareAuthors from './Tables/SoftwareAuthors'
import TextItem from './Components/TextItem'
interface Props {
  software: SchemaSoftwareSourceCode
  softwarePublicationLinks: SoftwareLinks[]
  relatedWorkLinks: SoftwareLinks[]
}

const AuthorsAndPublications = ({
  software,
  softwarePublicationLinks,
  relatedWorkLinks,
}: Props) => {
  const { t } = useTranslation()
  const theme = useTheme()

  return (
    <VStack w='full' alignItems='flex-start' spacing={10}>
      <Heading variant='h5' color='brand.primary'>
        {t('software:details_tab_contact_support')}
      </Heading>
      <SoftwareAuthors software={software} />

      <SoftwareFunding software={software} />

      {software['sd:hasAcknowledgements'] && (
        <TextItem
          title={t('software:authors_acknowledgments')}
          text={software['sd:hasAcknowledgements']}
        />
      )}


      {/* Both of these are not in the form? */}

      {!isEmpty(softwarePublicationLinks) && (
        <VStack alignItems='flex-start'>
          <Text variant='large'>{t('software:authors_publications')}</Text>
          <Text variant='medium'>{t('software:authors_publications_description')}</Text>
          {softwarePublicationLinks.map(publication => (
            <HStack key={publication.link} spacing={4}>
              <QuoteRight height={20} width={20} color={theme.colors.brand.primary} />
              <Link href={publication.link} isExternal>
                <Text variant='link'>
                  {publication.title.split('https')[0]}
                  <br />
                  {publication.link}
                </Text>
              </Link>
            </HStack>
          ))}
        </VStack>
      )}

      {relatedWorkLinks && !isEmpty(relatedWorkLinks) && (
        <VStack alignItems='flex-start'>
          <Text variant='large'>{t('software:authors_related_work')}</Text>
          {relatedWorkLinks.map(work => (
            <HStack key={work.link} spacing={4}>
              <QuoteRight height={20} width={20} color={theme.colors.brand.primary} />
              <Link href={`https://doi.org/${work.link}`} isExternal>
                <Text variant='link'>{work.title}</Text>
              </Link>
            </HStack>
          ))}
        </VStack>
      )}
    </VStack>
  )
}

export default AuthorsAndPublications
