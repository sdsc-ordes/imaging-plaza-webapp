import {Button, Flex} from '@chakra-ui/react'
import useTranslation from 'next-translate/useTranslation'
import {useRouter} from 'next/router'
import {useForm} from 'react-hook-form'
import {ROUTES_SETUP} from '../../constants/routes'
import {emailRegex} from '../../utils/dataHandling/validators'
import FormInput from '../Form/components/FormInput'
import {fetchCreateAccountWEmail} from '../../fetchers/auth'
import handleError from '../../utils/dataHandling/handleError'
import FormInputPassword from '../Form/components/FormPasswordInput'
import {useEffect} from 'react'

interface Props {
  email: string
  onBack: () => void
}

interface FormData {
  email: string
  password: string
}

const CreateEmailStep = ({email, onBack}: Props) => {
  const router = useRouter()
  const {t} = useTranslation()

  const {
    setValue,
    register,
    handleSubmit,
    formState: {errors},
  } = useForm<FormData>()
  useEffect(() => {
    setValue('email', email)
  }, [email, setValue])

  const onSubmit = async (data: FormData) => {
    const {email, password} = data

    try {
      await fetchCreateAccountWEmail(email, password)
      await router.push(ROUTES_SETUP)
    } catch (e: any) {
      if (e.code === 'auth/email-already-in-use') {
        handleError(e, t('account:create_account_error_exists'))
      } else {
        handleError(e, t('account:create_account_error_generic'))
      }
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
          {t('account:create_account_back')}
        </Button>
        <Button variant='primary' type='submit'>
          {t('account:create_account_next')}
        </Button>
      </Flex>
    </form>
  )
}

export default CreateEmailStep
