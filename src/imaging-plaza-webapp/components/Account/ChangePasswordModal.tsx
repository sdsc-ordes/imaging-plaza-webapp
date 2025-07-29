import {Button, HStack, ModalBody, ModalHeader, Text, VStack} from '@chakra-ui/react'
import {sendPasswordResetEmail} from 'firebase/auth'

import useTranslation from 'next-translate/useTranslation'
import {useState} from 'react'
import {useAuth} from '../../utils/AuthContext'
import {auth} from '../../utils/firebase/firebaseAuth'
import ModalContainer from '../Modal/ModalContainer'

interface Props {
  isOpen: boolean
  onClose: () => void
}

const ChangePasswordModal = ({isOpen, onClose}: Props) => {
  const {user} = useAuth()
  const {t} = useTranslation('account')
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const sendResetPasswordEmail = async () => {
    if (!user) return
    setIsLoading(true)
    const showToast = await import('../../utils/showToast').then(mod => mod.showToast)
    try {
      await sendPasswordResetEmail(auth, user.email!)
      showToast(t('account:change_password_email_success_toast_description'), 'success')
    } catch (e: any) {
      showToast(t('account:change_password_email_error_toast_description'), 'error')
    } finally {
      setIsLoading(false)
      onClose()
    }
  }

  return (
    <ModalContainer isOpen={isOpen} onClose={onClose}>
      <ModalHeader p={0} mb={5}>
        {t('account:change_password_modal_title')}
      </ModalHeader>
      <ModalBody p={0} alignItems='flex-start'>
        <VStack spacing={8}>
          <Text variant='medium' alignItems='flex-start' w='full'>
            {t('account:change_password_modal_description')}
          </Text>
          <HStack w='full' justifyContent='flex-end'>
            <Button variant='outlined' onClick={onClose}>
              {t('account:change_password_modal_cancel_button')}
            </Button>
            <Button variant='primary' onClick={sendResetPasswordEmail} isLoading={isLoading}>
              {t('account:change_password_modal_send_button')}
            </Button>
          </HStack>
        </VStack>
      </ModalBody>
    </ModalContainer>
  )
}
export default ChangePasswordModal
