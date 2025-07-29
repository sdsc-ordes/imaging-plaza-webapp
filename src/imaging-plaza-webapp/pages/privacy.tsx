import {Text} from '@chakra-ui/react'
import useTranslation from 'next-translate/useTranslation'
import CenteredContent from '../components/layouts/CenteredContent'
import HeadModule from '../components/Modules/HeaderModules'
import DOMPurify from 'isomorphic-dompurify';


const Privacy = () => {
  const {t} = useTranslation('navbar')
  const sanitizedContent = DOMPurify.sanitize(t('privacy:content'));


  return (
    <CenteredContent title={t('common:privacy_policy')}>
      <HeadModule title='privacy:meta_title' />
      <Text dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
    </CenteredContent>
  )
}

// noinspection JSUnusedGlobalSymbols
export default Privacy
