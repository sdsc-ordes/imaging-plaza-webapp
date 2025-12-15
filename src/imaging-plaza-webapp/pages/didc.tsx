import {Heading, Text, VStack} from '@chakra-ui/react'
import {GetStaticProps} from 'next'
import useTranslation from 'next-translate/useTranslation'
import CenteredContent from '../components/layouts/CenteredContent'
import HeadModule from '../components/Modules/HeaderModules'

const Didc = () => {
  const {t} = useTranslation()

  return (
    <CenteredContent title={t('didc:title')}>
      <HeadModule title='didc:meta_title' description='didc:meta_description' />
      <VStack gridGap={6}>
        <Heading variant='h4' as='h2' alignSelf='start'>
          {t('didc:about-text-title')}
        </Heading>
        <Text textAlign='start' w='full'>{t('didc:about-text_1')}</Text>
        <Text textAlign='justify'>{t('didc:about-text_2')}</Text>
        <Text textAlign='justify'>{t('didc:about-text_3')}</Text>

        <Heading variant='h4' as='h2' alignSelf='start'>
          {t('didc:access-text-title')}
        </Heading>
        <Text textAlign='start' w='full'>{t('didc:access-text_1')}</Text>
        
        <Heading variant='h4' as='h2' alignSelf='start'>
          {t('didc:datasets-text-title')}
        </Heading>
        <Text textAlign='start' w='full'>{t('didc:datasets-text_1')}</Text>
      </VStack>
    </CenteredContent>
  )
}

// noinspection JSUnusedGlobalSymbols
export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {},
    revalidate: 900,
  }
}

// noinspection JSUnusedGlobalSymbols
export default Didc