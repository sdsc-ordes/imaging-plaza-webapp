import {Button, HStack, ModalBody, ModalHeader, Text, VStack} from '@chakra-ui/react'
import useTranslation from 'next-translate/useTranslation'
import Link from 'next/link'
import {ROUTES_LOGIN} from '../../constants/routes'
import ModalContainer from '../Modal/ModalContainer'

interface Props {
  isOpen: boolean
  onClose: () => void
}

const ConnectionRequiredModal = ({isOpen, onClose}: Props) => {
  const {t} = useTranslation()

  return (
    <ModalContainer isOpen={isOpen} onClose={onClose}>
      <ModalHeader p={0} mb={5}>
        {t('software:modal_connection_required_title')}
      </ModalHeader>
      <ModalBody p={0} alignItems='flex-start'>
        <VStack spacing={8}>
          <Text variant='medium' alignItems='flex-start' w='full'>
            {t('software:modal_connection_required_description')}
          </Text>
          <HStack w='full' justifyContent='flex-end'>
            <Button variant='outlined' onClick={onClose}>
              {t('software:modal_connection_required_back')}
            </Button>
            <Link href={ROUTES_LOGIN} passHref>
              <Button variant='primary'>{t('software:modal_connection_required_log_in')}</Button>
            </Link>
          </HStack>
        </VStack>
      </ModalBody>
    </ModalContainer>
  )
}
export default ConnectionRequiredModal
