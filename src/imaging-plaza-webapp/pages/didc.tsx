import {Container, Heading, SimpleGrid, Text, useTheme, VStack} from '@chakra-ui/react'
import {GetStaticProps} from 'next'
import useTranslation from 'next-translate/useTranslation'
import PageHeader from '../components/Common/PageHeader'
import SoftwareSection from '../components/Common/SoftwareSection/SoftwareSection'
import Attribution from '../components/Home/Attribution'
import MainLayout from '../components/layouts/Mainlayout'
import HeadModule from '../components/Modules/HeaderModules'
import {useIsDesktop} from '../hooks/useIsDesktop'
import {getPopularSoftware} from '@/fetchers/software.server'
import {useMemo} from 'react'
import {DataFeed, SchemaSoftwareSourceCode} from '@/components/Form/schema'
import { DataFeedRow } from '@/components/SoftwareDetails/Tabs/Tables/DataFeedRow'

// Hardcoded datasets - update these with real data
const DIDC_DATASETS: DataFeed[] = [
  {
    '@type': 'schema:DataFeed',
    'schema:name': 'Example Dataset 1',
    'schema:description': 'Description of the first example dataset. This is a placeholder that should be replaced with real dataset information.',
    'schema:contentUrl': 'https://example.com/dataset1',
    'imag:imagingModality': ['Microscopy'],
  },
  {
    '@type': 'schema:DataFeed',
    'schema:name': 'Example Dataset 2',
    'schema:description': 'Description of the second example dataset. This is a placeholder that should be replaced with real dataset information.',
    'schema:contentUrl': 'https://example.com/dataset2',
    'imag:imagingModality': ['MRI'],
  },
  {
    '@type': 'schema:DataFeed',
    'schema:name': 'Example Dataset 3',
    'schema:description': 'Description of the third example dataset. This is a placeholder that should be replaced with real dataset information.',
    'schema:contentUrl': 'https://example.com/dataset3',
    'imag:imagingModality': ['CT'],
  },
]

interface Props {
  popularSoftwaresData: string
}

const Didc = ({popularSoftwaresData}: Props) => {
  const popularSoftwares = useMemo(
    () => JSON.parse(popularSoftwaresData) as SchemaSoftwareSourceCode[],
    [popularSoftwaresData]
  )
  const {t} = useTranslation()
  const theme = useTheme()
  const isDesktop = useIsDesktop()

  return (

    <MainLayout>
      <HeadModule title='didc:meta_title' description='didc:meta_description' />
      <Container maxW='container.lg' p={0}>
        <PageHeader title={t('didc:title')} />
        <VStack
          bg={theme.colors.brand.background}
          w='full'
          borderRadius='medium'
          alignItems='start'
          p={isDesktop ? 8 : 6}
          mb={20}
        >
          <VStack gridGap={6}>
            <Heading variant='h4' as='h2' alignSelf='start'>
              {t('didc:about-text-title')}
            </Heading>
            <Text textAlign='start' w='full'>{t('didc:about-text_1')}</Text>
        

            <Heading variant='h4' as='h2' alignSelf='start'>
              {t('didc:access-text-title')}
            </Heading>
            <Text textAlign='start' w='full'>{t('didc:access-text_1')}</Text>

            <Heading variant='h4' as='h2' alignSelf='start'>
              {t('didc:datasets-text-title')}
            </Heading>
            <SimpleGrid columns={{base: 1, md: 2}} spacing={4}>
            {DIDC_DATASETS.map((dataFeed, idx) => (
              <DataFeedRow key={idx} dataFeed={dataFeed} />
            ))}
          </SimpleGrid>
          </VStack>
        </VStack>
        <Attribution />
      </Container>
      <SoftwareSection
        softwareList={popularSoftwares} // TODO: hardcode software to display later
        title={t('didc:related-software-title')}
      />
    </MainLayout>
  )
}

// noinspection JSUnusedGlobalSymbols
export const getStaticProps: GetStaticProps = async () => {
  const popularSoftwaresData = JSON.stringify(await getPopularSoftware())

  return {
    props: {
      popularSoftwaresData,
    },
    revalidate: 900,
  }
}

// noinspection JSUnusedGlobalSymbols
export default Didc