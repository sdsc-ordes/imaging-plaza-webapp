import { Box, Divider, Link, Text, useTheme, VStack, Button } from '@chakra-ui/react'
import { SchemaSoftwareSourceCode } from '../../Form/schema'
import AlignLeft from '../../Icons/light/AlignLeft.svg'
import BalancedScale from '../../Icons/light/BalancedScale.svg'
import Code from '../../Icons/light/Code.svg'
import Pen from '../../Icons/solid/Pen.svg'
import Globe from '../../Icons/regular/Globe.svg'
import File from '../../Icons/solid/File.svg'
import AuthorInfoLine from './AuthorInfoLine'
import FairLevel from './FairLevel'
import InformationLine from './InformationLine'
import useTranslation from 'next-translate/useTranslation'
interface Props {
  software: SchemaSoftwareSourceCode
}

// date from schema to readable format
const formatDate = (dateString: string | Date) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

const formatLicense = (license: string) => {
  return license.split('/').pop()
}


const SoftwareInfo = ({ software }: Props) => {
  const theme = useTheme()
  const { t } = useTranslation()

  return (
    <VStack p={8} align='flex-start' h='full'>
      <AuthorInfoLine software={software} />
      <VStack gridGap={5} align='flex-start' flex={1}>
      <Divider />

        {software?.['schema:codeRepository'] && (

          <InformationLine icon={<Code height={14} width={14} color={theme.colors.brand.primary } />}>
            <Link href={software['schema:codeRepository'][0]} isExternal>
              <Text variant='link' minW='fit-content'>
                {t('schema:codeRepository_label')}
              </Text>
            </Link>
          </InformationLine>
        )}

        {/* Readme, Documentation, Executable Noteboks? */}

        {software['sd:readme'] && (
          <InformationLine icon={<File height={14} width={14} color={theme.colors.brand.primary } />}>
            <Link href={software['sd:readme']} isExternal>
              <Text variant='link' minW='fit-content'>
                {t('software:details_see_readme')}
              </Text>
            </Link>
          </InformationLine>
        )}

        {software['sd:hasDocumentation'] && (
          <InformationLine icon={<AlignLeft height={14} width={14} color={theme.colors.brand.primary } />}>
            <Link href={software['sd:hasDocumentation']} isExternal>
              <Text variant='link' minW='fit-content'>
                {t('software:details_see_documentation')}
              </Text>
            </Link>
          </InformationLine>
        )}
        {(software['schema:license']) && (
          <InformationLine icon={<BalancedScale height={14} width={14} color={theme.colors.brand.primary } />}>
            <Link href={software['schema:license']} isExternal>
              <Text variant='link' minW='fit-content'>
                {formatLicense(software['schema:license'])}
              </Text>
            </Link>
          </InformationLine>
        )}

        {/* Citation DOI is a list. schema:citation  */}
        {software['schema:citation'] && (
          <InformationLine icon={<Pen height={10} width={10} color={theme.colors.brand.primary } />}>
            <Button
              variant='link'
              onClick={() => software['schema:citation'].forEach(citation => {
                const link = document.createElement('a')
                link.href = citation
                link.target = '_blank'
                link.rel = 'noopener noreferrer'
                link.click()
              })}
            >
              {t('software:cite_this_software')}
            </Button>
          </InformationLine>
        )}

        {software?.['schema:url'] && (

          <InformationLine icon={<Globe height={14} width={14} color={theme.colors.brand.primary } />}>
            <Link href={software['schema:url']} isExternal>
              <Button variant='link' minW='fit-content'>
                {t('software:visit_website')}
              </Button>
            </Link>
          </InformationLine>
        )}
        {software['schema:dateCreated'] && (
          <Box alignItems='flex-start'>
            <Text color={theme.colors.brand.grey} variant='small'>{t('software:date_created')}: {formatDate(software['schema:dateCreated'])}</Text>
          </Box>
        )}
        {software['schema:datePublished'] && (
          <Box alignItems='flex-start'>
            <Text color={theme.colors.brand.grey} variant='small'>{t('software:date_published')}: {formatDate(software['schema:datePublished'])}</Text>
          </Box>
        )}

        <Divider />
        <FairLevel software={software} />
      </VStack>

    </VStack>
  )
}

export default SoftwareInfo
