import {Button, HStack, Input, Textarea, useTheme, VStack} from '@chakra-ui/react'
import useTranslation from 'next-translate/useTranslation'
import React from 'react'
import {useForm} from 'react-hook-form'
import {writeSupportMessage} from '../../fetchers/contactFetchers'
import {SupportMessageZod} from '../../models/SupportMessage'
import FormControlledInput from '../Form/FormControlledInput'
import PaperPlane from '../Icons/solid/PaperPlane.svg'

type FormData = {
  name: string
  email: string
  message: string
}

interface ContactPlaceholders {
  name: string
  email: string
}

const ContactForm = () => {
  const {t} = useTranslation()
  const theme = useTheme()

  const placeholders: ContactPlaceholders[] = [
    {name: 'Marie Curie', email: 'marie.curie@epfl.ch'},
    {name: 'Ada Lovelace', email: 'ada.lovelace@epfl.ch'},
    {name: 'Rosalind Franklin', email: 'rosalind.franklin@epfl.ch'},
    {name: 'Erna Hamburger', email: 'erna.hamburger@epfl.ch'},
    {name: 'Maryam Mirzakhani', email: 'maryam.mirzakhani@epfl.ch'},
    {name: 'Lise Meitner', email: 'lise.meitner@epfl.ch'},
    {name: 'Jane Goodall', email: 'jane.goodall@epfl.ch'},
  ]

  const aRandomContactPlaceholder = placeholders[Math.floor(Math.random() * placeholders.length)]

  const {
    register,
    handleSubmit,
    reset,
    formState: {errors, isSubmitting},
  } = useForm<FormData>()

  const onSubmit = async (values: any) => {
    const message = SupportMessageZod.parse(values)
    await writeSupportMessage(message)
    const showToast = await import('../../utils/showToast').then(mod => mod.showToast)
    showToast(t('contact_form_success'), 'success')
    reset()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{width: '100%'}}>
      <VStack
        p={5}
        spacing={6}
        background={theme.colors.brand.superLightGreen}
        w='full'
        borderRadius='medium'>
        <FormControlledInput
          label='Your name'
          error={'name' in errors}
          errorMessage={errors.name?.message}>
          <Input
            variant='filled'
            w='full'
            maxLength={100}
            placeholder={aRandomContactPlaceholder.name}
            {...register('name', {
              required: 'This field is required',
              maxLength: 100,
            })}
          />
        </FormControlledInput>

        <FormControlledInput
          label='Your email'
          error={'email' in errors}
          errorMessage={errors.email?.message}>
          <Input
            variant='filled'
            w='full'
            maxLength={100}
            placeholder={aRandomContactPlaceholder.email}
            {...register('email', {
              required: 'This field is required',
              pattern: {
                value: /^[^@]+@[^@]+\.[^@]+$/i,
                message: 'Invalid email',
              },
            })}
          />
        </FormControlledInput>

        <FormControlledInput
          label='Message'
          error={'message' in errors}
          errorMessage={errors.name?.message}>
          <Textarea
            variant='filled'
            w='full'
            minH='6rem'
            maxLength={500}
            placeholder='Write your message'
            {...register('message', {
              required: 'This field is required',
              maxLength: 500,
            })}
          />
        </FormControlledInput>

        <HStack w='full' justifyContent='flex-start'>
          <Button
            variant='primary'
            type='submit'
            isLoading={isSubmitting}
            leftIcon={<PaperPlane height={16} width={16} />}>
            {t('contact:form_send')}
          </Button>
        </HStack>
      </VStack>
    </form>
  )
}

export default ContactForm
