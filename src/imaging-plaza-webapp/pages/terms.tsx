import {Text} from '@chakra-ui/react'
import useTranslation from 'next-translate/useTranslation'
import React from 'react'
import CenteredContent from '../components/layouts/CenteredContent'
import HeadModule from '../components/Modules/HeaderModules'
import DOMPurify from 'isomorphic-dompurify';

const Terms = () => {
  const {t} = useTranslation('navbar')
  const sanitizedContent = DOMPurify.sanitize(t('terms:content'));


  return (
    <CenteredContent title={t('terms:title')}>
      <HeadModule title='terms:meta_title' />
      <Text>{t('terms:content')}</Text>
      <Text dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
    </CenteredContent>
  )
}

// noinspection JSUnusedGlobalSymbols
export default Terms
