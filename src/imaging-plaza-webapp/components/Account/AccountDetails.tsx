import {Button, Center, Heading, Stack, useDisclosure, useTheme, VStack} from '@chakra-ui/react'
import useTranslation from 'next-translate/useTranslation'
import dynamic from 'next/dynamic'
import UserDetails from './UserDetails'
import {useIsDesktop} from '../../hooks/useIsDesktop'
import Pen from '../Icons/solid/Pen.svg'
import Lock from '../Icons/solid/Lock.svg'
import {useAuth} from '../../utils/AuthContext'

const ChangePasswordModal = dynamic(() => import('./ChangePasswordModal'))
const EditProfileModal = dynamic(() => import('./EditProfileModal'))

interface PropsActions {
  providerIsEmail: boolean
  onOpenProfileModal: () => void
  onOpenPasswordModal: () => void
}
const ActionButtons = ({
  onOpenProfileModal,
  providerIsEmail,
  onOpenPasswordModal,
}: PropsActions) => {
  const {t} = useTranslation('account')
  const theme = useTheme()

  return (
    <Stack
      direction={{base: 'column', md: 'row'}}
      alignItems={{base: 'center', md: 'start'}}
      spacing={2.5}>
      <Button
        onClick={onOpenProfileModal}
        variant='outlined'
        bg={theme.colors.brand.white}
        leftIcon={<Pen height={14} width={14} />}>
        {t('account:edit_button')}
      </Button>
      {providerIsEmail && (
        <Button
          onClick={onOpenPasswordModal}
          variant='outlined'
          bg={theme.colors.brand.white}
          leftIcon={<Lock height={14} width={14} />}>
          {t('account:change_password_button')}
        </Button>
      )}
    </Stack>
  )
}

const AccountDetails = () => {
  const {t} = useTranslation('account')
  const isDesktop = useIsDesktop()

  const {user} = useAuth()

  let providerIsEmail = false
  if (user) {
    providerIsEmail = user.firebase.providerData[0].providerId === 'password'
  }

  const {
    isOpen: isOpenPasswordModal,
    onOpen: onOpenPasswordModal,
    onClose: onClosePasswordModal,
  } = useDisclosure()

  const {
    isOpen: isOpenProfileModal,
    onOpen: onOpenProfileModal,
    onClose: onCloseProfileModal,
  } = useDisclosure()

  return (
    <VStack w='full' spacing={6}>
      <Stack
        w='full'
        direction={{base: 'column', md: 'row'}}
        alignItems={{base: 'start', md: 'center'}}
        justifyContent={{base: 'center', md: 'space-between'}}
        spacing={2.5}>
        <Heading variant='h6'>{t('account:label')}</Heading>
        {isDesktop && (
          <ActionButtons
            onOpenPasswordModal={onOpenPasswordModal}
            providerIsEmail={providerIsEmail}
            onOpenProfileModal={onOpenProfileModal}
          />
        )}
      </Stack>
      <Center w='full' h='full'>
        <VStack w='full'>
          <UserDetails />
        </VStack>
      </Center>
      {!isDesktop && (
        <Center>
          <ActionButtons
            onOpenPasswordModal={onOpenPasswordModal}
            providerIsEmail={providerIsEmail}
            onOpenProfileModal={onOpenProfileModal}
          />
        </Center>
      )}
      {isOpenPasswordModal && (
        <ChangePasswordModal isOpen={isOpenPasswordModal} onClose={onClosePasswordModal} />
      )}
      {isOpenProfileModal && (
        <EditProfileModal
          isOpen={isOpenProfileModal}
          onClose={onCloseProfileModal}
          providerIsEmail={providerIsEmail}
        />
      )}
    </VStack>
  )
}
export default AccountDetails
