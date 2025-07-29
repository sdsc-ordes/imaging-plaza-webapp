import {Heading, VStack} from '@chakra-ui/react'
import {Faq} from '../../models/Faq'
import Question from './Question'
import {useIsDesktop} from '../../hooks/useIsDesktop'

interface Props {
  category: string
  questions: Faq[]
}

const FaqQuestionsCategory = ({category, questions}: Props) => {
  const isDesktop = useIsDesktop()

  return (
    <>
      <Heading variant='h6' mb={4}>
        {category}
      </Heading>
      <VStack alignItems='start' w="full" gridGap={isDesktop ? 5 : 2}>
        {questions.map(question => (
          <Question question={question} key={question.id} />
        ))}
      </VStack>
    </>
  )
}

export default FaqQuestionsCategory
