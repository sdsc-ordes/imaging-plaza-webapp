import {Box, Spinner, useTheme} from '@chakra-ui/react'
import orderBy from 'lodash/orderBy'
import groupBy from 'lodash/groupBy'
import {GetStaticProps} from 'next'
import useTranslation from 'next-translate/useTranslation'
import FaqQuestionsCategory from '../components/FAQ/FAQQuestionsCategory'
import CenteredContent from '../components/layouts/CenteredContent'
import {Faq as FaqModel} from '../models/Faq'
import HeadModule from '../components/Modules/HeaderModules'
import {getFaq} from '../fetchers/faq.server'
import React from 'react'

interface Props {
  questions: FaqModel[]
}

const Faq = ({questions}: Props) => {
  const {t} = useTranslation()
  const theme = useTheme()

  return (
    <CenteredContent title={t('faq:FAQ')}>
      <HeadModule title='faq:meta_title' description='faq:meta_description' />
      {questions ? (
        Object.entries(groupBy(questions, 'categoryEn')).map((category, index) => {
          const categoryKey = category[0]
          const questions = orderBy(category[1], 'questionOrder')

          return (
            <React.Fragment key={categoryKey}>
              <Box pb={8} w='full' placeItems='start'>
                <FaqQuestionsCategory category={categoryKey} questions={questions} />
              </Box>
            </React.Fragment>
          )
        })
      ) : (
        <Spinner alignSelf='center' color={theme.colors.brand.accentuation} />
      )}
    </CenteredContent>
  )
}

// noinspection JSUnusedGlobalSymbols
export const getStaticProps: GetStaticProps = async () => {
  const questions = await getFaq()

  return {
    props: {
      questions,
    },
    revalidate: 900,
  }
}

// noinspection JSUnusedGlobalSymbols
export default Faq
