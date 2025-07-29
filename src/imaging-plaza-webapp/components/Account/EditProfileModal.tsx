import {
  Button,
  HStack,
  Input,
  ModalBody,
  ModalHeader,
  useDisclosure,
  VStack,
} from '@chakra-ui/react'
import useTranslation from 'next-translate/useTranslation'
import dynamic from 'next/dynamic'
import {useEffect} from 'react'
import {useForm} from 'react-hook-form'
import {fetchSetUser} from '../../fetchers/auth'
import {useAuth} from '../../utils/AuthContext'
import FormControlledInput from '../Form/FormControlledInput'
import ModalContainer from '../Modal/ModalContainer'

interface Props {
  isOpen: boolean
  onClose: () => void
  providerIsEmail: boolean
}

type FormData = {
  firstName: string
  lastName: string
  email?: string
}

const EditProfileModal = ({isOpen, onClose, providerIsEmail}: Props) => {
  const {user} = useAuth()
  const {t} = useTranslation()

  const {
    register,
    handleSubmit,
    setValue,
    formState: {errors, isSubmitting},
  } = useForm<FormData>()

  const getReconnectionModal = () => {
    const ReconnectionNeededModal = dynamic(() => import('./ReconnectionNeededModal'))
    return (
      <ReconnectionNeededModal
        isOpen={isOpenReconnectionModal}
        onClose={onCloseReconnectionModal}
      />
    )
  }

  const onSubmit = async (values: any) => {
    if (!user) return
    const showToast = await import('../../utils/showToast').then(mod => mod.showToast)
    try {
      await fetchSetUser(user.firebase, values.firstName, values.lastName, values.email)
      showToast(t('common:generic_success'), 'success')
      onClose()
    } catch (e: any) {
      onOpenReconnectionModal()
    }
  }

  useEffect(() => {
    if (!user) return
    setValue('firstName', user.firstName)
    setValue('lastName', user.lastName)
    if (providerIsEmail) {
      setValue('email', user.email)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const {
    isOpen: isOpenReconnectionModal,
    onOpen: onOpenReconnectionModal,
    onClose: onCloseReconnectionModal,
  } = useDisclosure()

  return (
    <>
      {isOpenReconnectionModal && getReconnectionModal()}
      <ModalContainer isOpen={isOpen} onClose={onClose}>
        <ModalHeader p={0} mb={5}>
          {t('account:edit_profile_modal_title')}
        </ModalHeader>
        <ModalBody p={0} alignItems='flex-start'>
          <form onSubmit={handleSubmit(onSubmit)}>
            <VStack spacing={8}>
              <FormControlledInput
                label='You first name'
                error={'firstName' in errors}
                errorMessage={errors.firstName?.message}>
                <Input
                  variant='filled'
                  w='full'
                  maxLength={100}
                  placeholder='First Name'
                  {...register('firstName', {
                    required: 'This field is required',
                    maxLength: 100,
                  })}
                />
              </FormControlledInput>
              <FormControlledInput
                label='Your last name'
                error={'lastName' in errors}
                errorMessage={errors.lastName?.message}>
                <Input
                  variant='filled'
                  w='full'
                  maxLength={100}
                  placeholder='Last Name'
                  {...register('lastName', {
                    required: 'This field is required',
                    maxLength: 100,
                  })}
                />
              </FormControlledInput>
              {providerIsEmail && (
                <FormControlledInput
                  label='Your email'
                  error={'email' in errors}
                  errorMessage={errors.email?.message}>
                  <Input
                    variant='filled'
                    w='full'
                    maxLength={100}
                    placeholder='Email'
                    {...register('email', {
                      required: 'This field is required',
                      pattern: {
                        value: /^[^@]+@[^@]+\.[^@]+$/i,
                        message: 'Invalid email',
                      },
                    })}
                  />
                </FormControlledInput>
              )}
              <HStack w='full' justifyContent='flex-end'>
                <Button variant='outlined' onClick={onClose}>
                  {t('account:edit_profile_modal_cancel_button')}
                </Button>
                <Button variant='primary' type='submit' isLoading={isSubmitting}>
                  {t('account:edit_profile_modal_save_button')}
                </Button>
              </HStack>
            </VStack>
          </form>
        </ModalBody>
      </ModalContainer>
    </>
  )
}

export default EditProfileModal
