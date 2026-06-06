import {Button, Flex} from '@chakra-ui/react'
import useTranslation from 'next-translate/useTranslation'
import {useForm} from 'react-hook-form'
import {emailRegex} from '../../utils/dataHandling/validators'
import FormInput from '../Form/components/FormInput'

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

  // GoTrue does not expose an "is this email already registered" probe
  // (intentionally, to avoid leaking account existence). The duplicate
  // check happens at signup time in CreatePasswordStep instead.
  const onSubmit = async (data: FormData) => {
    onNext(data.email)
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
