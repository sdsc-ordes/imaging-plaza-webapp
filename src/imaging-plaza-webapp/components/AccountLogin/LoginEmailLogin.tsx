import {Button, Flex} from '@chakra-ui/react'
import useTranslation from 'next-translate/useTranslation'
import {useForm} from 'react-hook-form'
import {emailRegex} from '../../utils/dataHandling/validators'
import FormInput from '../Form/components/FormInput'
import FormInputPassword from '../Form/components/FormPasswordInput'
import handleError from '../../utils/dataHandling/handleError'
import {fetchCheckEmailProvider} from '../../fetchers/auth'
import {useAuth} from '../../utils/AuthContext'

interface Props {
  onBack: () => void
}

interface FormData {
  email: string
  password: string
}

const LoginEmailLogin = ({onBack}: Props) => {
  const {t} = useTranslation()

  const {loginWithEmail} = useAuth()

  const {
    register,
    handleSubmit,
    formState: {errors},
  } = useForm<FormData>()

  const onSubmit = async (data: FormData) => {
    const provider = await fetchCheckEmailProvider(data.email)

    if (provider !== 'password') {
      handleError(null, t('account:login_error_provider'))
    } else {
      await loginWithEmail(data.email, data.password)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{width: '100%'}}>
      <Flex direction='column' gap={10}>
        <FormInput<FormData>
          errors={errors}
          name='email'
          register={register}
          placeholder={t('account:login_your_mail')}
          label={t('account:login_email')}
          rules={{
            required: t('account:create_account_email_required'),
            pattern: {
              value: emailRegex,
              message: t('account:create_account_email_invalid'),
            },
          }}
        />
        <FormInputPassword<FormData>
          name='password'
          label={t('account:login_password')}
          register={register}
          placeholder={t('account:login_your_password')}
          errors={errors}
          rules={{required: t('account:create_account_password_required')}}
        />
      </Flex>
      <Flex justifyContent='end' pt={2}>
        <Button variant='ghost' onClick={onBack}>
          {t('account:login_back')}
        </Button>
        <Button variant='primary' type='submit'>
          {t('account:login_sign_in')}
        </Button>
      </Flex>
    </form>
  )
}

export default LoginEmailLogin
