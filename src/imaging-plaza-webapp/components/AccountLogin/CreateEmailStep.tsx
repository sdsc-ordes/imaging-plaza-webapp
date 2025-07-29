import {Button, Flex} from '@chakra-ui/react'
import useTranslation from 'next-translate/useTranslation'
import {useForm} from 'react-hook-form'
import {emailRegex} from '../../utils/dataHandling/validators'
import FormInput from '../Form/components/FormInput'
import {fetchCheckEmail} from '../../fetchers/auth'
interface Props {
  onNext: (email: string) => void
}

interface FormData {
  email: string
}

const CreateEmailStep = ({onNext}: Props) => {
  const {t} = useTranslation()

  const {
    register,
    handleSubmit,
    formState: {errors},
  } = useForm<FormData>()

  const onSubmit = async (data: FormData) => {
    const {email} = data
    console.info('User data successfully loaded', data);
    const usedEmail = await fetchCheckEmail(email)
    if (usedEmail) {
      alert(t('account:create_account_error_exists'))
    } else {
      onNext(email)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{width: '100%'}}>
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
      <Flex justifyContent='end' pt={2}>
        <Button variant='primary' type='submit'>
          {t('account:create_account_next')}
        </Button>
      </Flex>
    </form>
  )
}

export default CreateEmailStep
