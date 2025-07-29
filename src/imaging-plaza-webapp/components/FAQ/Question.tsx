import {Faq} from '../../models/Faq'
import {useState, useEffect} from 'react'
import {Collapse, HStack, Text, useTheme, VStack} from '@chakra-ui/react'
//import InjectHtml from '../Common/InjectHtml'
import Plus from '../Icons/solid/Plus.svg'
import Minus from '../Icons/solid/Minus.svg'
// import DOMPurify from 'isomorphic-dompurify';

import { useRouter } from 'next/router';

interface Props {
  question: Faq
}

const Question = ({question}: Props) => {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [showQuestion, setShowQuestion] = useState<boolean>(false)
  const theme = useTheme()
  const slug = generateSlug(question.questionEn);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (router.isReady && router.asPath.includes(`#${slug}`)) {
      setTimeout(() => {
        const element = document.getElementById(slug);
        if (element) {
          const offset = 50;
          const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
          const offsetPosition = elementPosition - offset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }, 100);
      setShowQuestion(true);
    }
  }, [router.isReady, router.asPath, slug]);

  const handleToggle = () => {
    setShowQuestion(!showQuestion);
  };

  return (
    <VStack
      bg={theme.colors.brand.white}
      alignItems='start'
      borderRadius='big'
      w='full'
      py={3}
      px={5}
      _hover={{cursor: 'pointer'}}>
      <HStack justify='space-between' w='full' onClick={handleToggle}>
        <Text color={theme.colors.brand.primary} variant='semiBold'>
          {question.questionEn}
        </Text>

        {showQuestion ? (
          <Minus width={16} height={16} color={theme.colors.brand.primary} />
        ) : (
          <Plus width={16} height={16} color={theme.colors.brand.primary} />
        )}
      </HStack>
      {mounted && (
        <Collapse in={showQuestion} animateOpacity id={slug}>
          <Text dangerouslySetInnerHTML={{ __html: question.answerEn }} />
        </Collapse>
      )}
    </VStack>
  )
}

const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export default Question
