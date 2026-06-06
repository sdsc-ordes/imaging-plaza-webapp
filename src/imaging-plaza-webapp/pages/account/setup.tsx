import {Button, Flex, Heading, Text, useTheme} from '@chakra-ui/react'
import useTranslation from 'next-translate/useTranslation'
import {useRouter} from 'next/router'
import LoginCard from '../../components/AccountLogin/LoginCard'
import LoginLayout from '../../components/layouts/LoginLayout'
import {ROUTES_ACCOUNT, ROUTES_HOME, ROUTES_LOGIN} from '../../constants/routes'
import {useForm} from 'react-hook-form'
import FormInput from '../../components/Form/components/FormInput'
import handleError from '../../utils/dataHandling/handleError'
import {useSupabaseAuth} from '../../utils/SupabaseAuthContext'
import {getSupabaseClient} from '../../utils/supabase/client'
import {useEffect} from 'react'

interface FormData {
  firstName: string
  lastName: string
}

const Setup = () => {
  const router = useRouter()
  const theme = useTheme()
  const {user, logout: supabaseLogout} = useSupabaseAuth()
  const {t} = useTranslation()

  const {
    register,
    handleSubmit,
    reset,
    formState: {errors},
  } = useForm<FormData>()

  useEffect(() => {
    reset(user ?? {})
  }, [reset, user])

  const logout = async () => {
    await supabaseLogout()
    await router.push(ROUTES_LOGIN)
  }

  const onSubmit = async (data: FormData) => {
    if (!user) return await router.push(ROUTES_HOME)

    const {firstName, lastName} = data
    const {error} = await getSupabaseClient()
      .from('profiles')
      .update({first_name: firstName, last_name: lastName})
      .eq('id', user.id)

    if (error) {
      handleError(error, t('account:setup_account_error_generic'))
      return
    }

    await router.push(ROUTES_ACCOUNT)
  }

  return (
    <LoginLayout>
      <LoginCard>
        <Heading variant='h2'>{t('account:setup_account_title')}</Heading>
        <Text px='1rem'>{t('account:setup_account_text')}</Text>
        <form onSubmit={handleSubmit(onSubmit)} style={{width: '100%'}}>
          <Flex direction='column' gap={10}>
            <FormInput<FormData>
              errors={errors}
              name='firstName'
              register={register}
              placeholder={t('account:setup_your_first_name')}
              label={t('account:setup_your_first_name')}
              rules={{
                required: t('account:create_account_email_required'),
              }}
            />
            <FormInput<FormData>
              errors={errors}
              name='lastName'
              register={register}
              placeholder={t('account:setup_your_last_name')}
              label={t('account:setup_your_last_name')}
              rules={{
                required: t('account:create_account_email_required'),
              }}
            />
          </Flex>
          <Flex justifyContent='end' pt={2}>
            <Button variant='primary' type='submit'>
              {t('account:create_account_next')}
            </Button>
          </Flex>
        </form>
        <Text as='button' color={theme.colors.brand.primary} onClick={logout}>
          {t('account:setup_account_logout')}
        </Text>
      </LoginCard>
    </LoginLayout>
  )
}

// noinspection JSUnusedGlobalSymbols
export default Setup
