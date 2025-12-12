
import useTranslation from "next-translate/useTranslation"
import CenteredContent from '../components/layouts/CenteredContent'
import HeadModule from '../components/Modules/HeaderModules'
import { VStack } from "@chakra-ui/react"
import { Heading } from "@chakra-ui/react"
import { Text } from "@chakra-ui/react"
    


  
  const Didc = () => {
    const {t} = useTranslation()
  
    return (
      <CenteredContent title={t('didc:title')}>
        <HeadModule title='about:meta_title' description='about:meta_title' />
        <VStack gridGap={6}>
          <Heading variant='h4' as='h2' alignSelf='start'>
            {t('didc:abou-text-title')}
          </Heading>
          <Text textAlign='start' w='full'>{t('didc:text_1')}</Text>
          <Text textAlign='justify'>{t('didc:text_2')}</Text>
          <Text textAlign='justify'>{t('didc:text_3')}</Text>
                
        </VStack>
      </CenteredContent>
    )
  }
  

  
  // noinspection JSUnusedGlobalSymbols
  export default Didc