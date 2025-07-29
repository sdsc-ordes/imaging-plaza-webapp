import {
  Button,
  Heading,
  Link as ChakraLink,
  Modal,
  ModalContent,
  ModalOverlay,
  Text,
  useTheme,
  VStack,
} from '@chakra-ui/react'
import useTranslation from 'next-translate/useTranslation'
import Link from 'next/link'
import {ROUTES_EDIT_SOFTWARE_FORM} from '../../constants/routes'

interface Props {
  isOpen: boolean
  onClose: () => void
  softwareId?: string
}

const ValidateModal = ({isOpen, onClose, softwareId}: Props) => {
  const theme = useTheme()
  const {t} = useTranslation()
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent p={8}>
        <VStack spacing={8}>
          <Heading variant='h4'>{t('overview:modal_title')}</Heading>
          <VStack>
            <Text>{t('overview:modal_text_1')}</Text>
            <Text>{t('overview:modal_text_2')}</Text>
            <Text>
              <p>{t('overview:modal_text_3')}</p>
              <p>{t('overview:modal_text_4')}</p>
            </Text>
            <Text>
              {t('overview:modal_text_5')}
              <ChakraLink _focus={{boxShadow: 'none'}} color={theme.colors.brand.primary}>
                {t('overview:modal_link')}
              </ChakraLink>
            </Text>
          </VStack>
          <Link href={ROUTES_EDIT_SOFTWARE_FORM(softwareId ?? '')} passHref>
            <Button variant='primary' disabled={!softwareId}>
              {t('overview:modal_button')}
            </Button>
          </Link>
        </VStack>
      </ModalContent>
    </Modal>
  )
}

export default ValidateModal
