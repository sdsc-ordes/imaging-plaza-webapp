import {Button, Stack, Text, useTheme, VStack} from '@chakra-ui/react'
import useTranslation from 'next-translate/useTranslation'
import Link from 'next/link'
import AccountDetails from '../../components/Account/AccountDetails'
import Bookmarks from '../../components/Account/Bookmarks'
import SoftwareAdded from '../../components/Account/SoftwareAdded'
import PageHeader from '../../components/Common/PageHeader'
import MainLayout from '../../components/layouts/Mainlayout'
import {ROUTES_CONTACT} from '../../constants/routes'
import Plus from '../../components/Icons/solid/Plus.svg'
import Bookmark from '../../components/Icons/regular/Bookmark.svg'
import User from '../../components/Icons/regular/User.svg'
import {useRouter} from 'next/router'
import {Role} from '../../models/User'
import {useAuth} from '../../utils/AuthContext'
import {WithUserStore} from '../../stores/userStore'

enum ProfileScreen {
  SoftwareAdded = 'softwareAdded',
  Bookmarks = 'bookmarks',
  Account = 'account',
}

const profileTabs = [
  {
    text: 'account:bookmarks_label',
    href: ProfileScreen.Bookmarks,
    icon: <Bookmark height={18} width={18} />,
  },
  {
    text: 'account:software_added_label',
    icon: <Plus height={18} width={18} />,
    href: ProfileScreen.SoftwareAdded,
  },
  {
    text: 'account:label',
    icon: <User height={18} width={18} />,
    href: ProfileScreen.Account,
  },
]

const Index = () => {
  const {t} = useTranslation()
  const theme = useTheme()

  const router = useRouter()
  const step = router.query.step?.toString()

  const {user} = useAuth()

  const renderProfileScreen = () => {
    switch (step) {
      case ProfileScreen.SoftwareAdded:
        return <SoftwareAdded />
      case ProfileScreen.Bookmarks:
        return <Bookmarks />
      case ProfileScreen.Account:
        return <AccountDetails />
    }
  }

  return (
    <MainLayout restrictedType={[Role.ADMIN, Role.USER]}>
      <PageHeader title={user?.firebase?.displayName ?? t('common:my_account')} />
      <Stack direction={{base: 'column', md: 'row'}} spacing={8} mb={20}>
        <VStack
          w={{base: 'full', md: 80}}
          minW={80}
          spacing={8}
          px={{base: 8, md: 0}}
          alignItems='start'>
          <VStack
            w='full'
            p={8}
            spacing={5}
            borderRadius='big'
            bg={theme.colors.brand.background}
            alignItems='start'>
            {profileTabs.map(item => (
              <Link
                replace
                passHref
                key={item.href}
                href={{pathname: router.pathname, query: {...router.query, step: item.href}}}>
                {/* Removing as='a' to avoid hydration problem */}
                <Button variant='link' isActive={item.href === step} leftIcon={item.icon}> 
                  {t(item.text)}
                </Button>
              </Link>
            ))}
          </VStack>
          <VStack alignItems='start' pl={8} spacing={0} display={{base: 'none', md: 'initial'}}>
            <Text>{t('account:contact_us_question')}</Text>
            <Link href={ROUTES_CONTACT} passHref>
              <Text
                color={theme.colors.brand.primary}
                _hover={{cursor: 'pointer', color: theme.colors.brand.accentuation}}>
                {t('account:contact_us_link')}
              </Text>
            </Link>
          </VStack>
        </VStack>
        <WithUserStore>
          <VStack
            w='full'
            p={8}
            spacing={8}
            borderRadius='big'
            alignItems='start'
            bg={theme.colors.brand.background}>
            {renderProfileScreen()}
          </VStack>
        </WithUserStore>
      </Stack>
    </MainLayout>
  )
}

// noinspection JSUnusedGlobalSymbols
export default Index
