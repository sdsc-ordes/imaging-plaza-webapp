import FormInput from '@/components/Form/components/FormInput'
import {sendPasswordReset} from '@/fetchers/auth'
import {emailRegex} from '@/utils/dataHandling/validators'
import {Button, Flex, Heading, useBoolean} from '@chakra-ui/react'
import {toast} from '@coteries/react/ui'
import {zodResolver} from '@hookform/resolvers/zod'
import useTranslation from 'next-translate/useTranslation'
import {useRouter} from 'next/router'
import {useForm} from 'react-hook-form'
import {z} from 'zod'
import LoginCard from '../../components/AccountLogin/LoginCard'
import LoginLayout from '../../components/layouts/LoginLayout'

const FormData = z.object({
  email: z.string().email(),
})

type FormData = z.infer<typeof FormData>

const Create = () => {
  const router = useRouter()
  const {t} = useTranslation('account')
  const [isSending, setSending] = useBoolean(false)
  const {
    register,
    handleSubmit,
    formState: {errors, isValid},
  } = useForm<FormData>({resolver: zodResolver(FormData)})

  const onSubmit = async (data: FormData) => {
    try {
      const {email} = data
      setSending.on()
      await sendPasswordReset(email)
    } catch (e) {
    } finally {
      setSending.off()
      toast.success(t('email_sent'), {duration: 5000})
    }
  }

  return (
    <LoginLayout>
      <LoginCard>
        <Heading variant='h2'>{t('forgot_pw')}</Heading>

        <form onSubmit={handleSubmit(onSubmit)} style={{width: '100%'}}>
          <FormInput<FormData>
            errors={errors}
            name='email'
            register={register}
            placeholder={t('login_your_mail')}
            label={t('login_email')}
            rules={{
              required: t('create_account_email_required'),
              pattern: {
                value: emailRegex,
                message: t('create_account_email_invalid'),
              },
            }}
          />
          <Flex justifyContent='end' pt={2}>
            <Button variant='ghost' onClick={() => router.back()}>
              {t('account:back')}
            </Button>
            <Button variant='primary' type='submit' isLoading={isSending} isDisabled={!isValid}>
              {t('account:send_recovery_email')}
            </Button>
          </Flex>
        </form>
      </LoginCard>
    </LoginLayout>
  )
}

// noinspection JSUnusedGlobalSymbols
export default Create
