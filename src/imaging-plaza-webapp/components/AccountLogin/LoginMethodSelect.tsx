import {Button, Text, VStack} from '@chakra-ui/react'
import useTranslation from 'next-translate/useTranslation'
import Envelope from '../Icons/solid/Envelope.svg'
import Google from '../Icons/brand/Google.svg'
import Github from '../Icons/brand/Github.svg'
import {useAuth} from '../../utils/AuthContext'

interface Props {
  onEmail: () => void
}

const LoginMethodSelect = ({onEmail}: Props) => {
  const {t} = useTranslation()

  const {isLoading, loginWithGoogle, loginWithGitHub} = useAuth()

  const login = async () => {
    await loginWithGoogle()
  }

  const githubLogin = async () => {
    await loginWithGitHub()
  }

  return (
    <>
      <Text px='1rem'>{t('account:login_text')}</Text>
      <VStack spacing='1rem' w='full'>
        <Button
          variant='primary'
          leftIcon={<Google height={16} width={16} />}
          w='full'
          isLoading={isLoading}
          onClick={login}>
          {t('account:login_google')}
        </Button>
        <Button
          variant='primary'
          leftIcon={<Github height={16} width={16} />}
          w='full'
          isLoading={isLoading}
          onClick={githubLogin}>
          {t('account:login_github')}
        </Button>
        <Button
          variant='primary'
          leftIcon={<Envelope height={16} width={16} />}
          w='full'
          isLoading={isLoading}
          onClick={onEmail}>
          {t('account:login_email')}
        </Button>
      </VStack>
    </>
  )
}

export default LoginMethodSelect
