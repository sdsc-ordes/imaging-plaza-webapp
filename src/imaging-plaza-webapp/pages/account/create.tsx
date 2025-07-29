import {Heading, Text, useTheme} from '@chakra-ui/react'
import useTranslation from 'next-translate/useTranslation'
import Link from 'next/link'
import {useState} from 'react'
import CreateEmailStep from '../../components/AccountLogin/CreateEmailStep'
import CreatePasswordStep from '../../components/AccountLogin/CreatePasswordStep'
import LoginCard from '../../components/AccountLogin/LoginCard'
import LoginLayout from '../../components/layouts/LoginLayout'
import {ROUTES_LOGIN} from '../../constants/routes'

const Create = () => {
  const theme = useTheme()
  const {t} = useTranslation()

  const [email, setEmail] = useState<string | null>(null)

  return (
    <LoginLayout>
      <LoginCard>
        <Heading variant='h2'>{t('account:create_account_title')}</Heading>
        <Text px='1rem'>{t('account:create_account_text')}</Text>
        {email ? (
          <CreatePasswordStep email={email} onBack={() => setEmail(null)} />
        ) : (
          <CreateEmailStep onNext={email => setEmail(email)} />
        )}
        <Link href={ROUTES_LOGIN} passHref>
          <Text as='button' color={theme.colors.brand.primary}>
            {t('account:create_account_login_redirect')}
          </Text>
        </Link>
      </LoginCard>
    </LoginLayout>
  )
}

// noinspection JSUnusedGlobalSymbols
export default Create
