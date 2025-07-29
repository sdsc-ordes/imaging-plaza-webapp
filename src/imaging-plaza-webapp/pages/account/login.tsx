import {Heading, Text, useTheme} from '@chakra-ui/react'
import useTranslation from 'next-translate/useTranslation'
import Link from 'next/link'
import {useState} from 'react'
import LoginCard from '../../components/AccountLogin/LoginCard'
import LoginEmailLogin from '../../components/AccountLogin/LoginEmailLogin'
import LoginMethodSelect from '../../components/AccountLogin/LoginMethodSelect'
import LoginLayout from '../../components/layouts/LoginLayout'
import {ROUTES_FORGOT_PW, ROUTES_SIGNUP} from '../../constants/routes'

const Login = () => {
  const theme = useTheme()
  const {t} = useTranslation()

  const [emailLogin, setEmailLogin] = useState<boolean>(false)

  return (
    <LoginLayout>
      <LoginCard>
        <Heading variant='h2'>{t('account:login_title')}</Heading>
        {emailLogin ? (
          <LoginEmailLogin onBack={() => setEmailLogin(false)} />
        ) : (
          <LoginMethodSelect onEmail={() => setEmailLogin(true)} />
        )}
        <Link href={ROUTES_FORGOT_PW} passHref>
          <Text as='button' color={theme.colors.brand.primary}>
            {t('account:forgot_pw')}
          </Text>
        </Link>
        <Link href={ROUTES_SIGNUP} passHref>
          <Text as='button' color={theme.colors.brand.primary}>
            {t('account:login_no_account')}
          </Text>
        </Link>
      </LoginCard>
    </LoginLayout>
  )
}

// noinspection JSUnusedGlobalSymbols
export default Login
