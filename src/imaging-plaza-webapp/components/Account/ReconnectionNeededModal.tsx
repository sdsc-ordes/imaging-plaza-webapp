import {Button, HStack, ModalBody, ModalHeader, Text, VStack} from '@chakra-ui/react'
import useTranslation from 'next-translate/useTranslation'
import {fetchLogout} from '../../fetchers/auth'
import ModalContainer from '../Modal/ModalContainer'

interface Props {
  isOpen: boolean
  onClose: () => void
}

const ReconnectionNeededModal = ({isOpen, onClose}: Props) => {
  const {t} = useTranslation('account')

  return (
    <ModalContainer isOpen={isOpen} onClose={onClose}>
      <ModalHeader p={0} mb={5}>
        {t('account:reconnection_needed_modal_title')}
      </ModalHeader>
      <ModalBody p={0} alignItems='flex-start'>
        <VStack spacing={8}>
          <Text variant='medium' alignItems='flex-start' w='full'>
            {t('account:reconnection_needed_modal_description')}
          </Text>
          <HStack w='full' justifyContent='flex-end'>
            <Button variant='outlined' onClick={onClose}>
              {t('account:reconnection_needed_modal_cancel_button')}
            </Button>
            <Button variant='primary' onClick={fetchLogout}>
              {t('account:reconnection_needed_modal_ok_button')}
            </Button>
          </HStack>
        </VStack>
      </ModalBody>
    </ModalContainer>
  )
}
export default ReconnectionNeededModal
