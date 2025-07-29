import {Divider, Flex, Menu, MenuButton, MenuItem, MenuList} from '@chakra-ui/react'
import useTranslation from 'next-translate/useTranslation'
import Image from 'next/image'
import {useRouter} from 'next/router'
import {fetchLogout} from '../../../fetchers/auth'
import {Role} from '../../../models/User'
import {
  ROUTES_ABOUT,
  ROUTES_ACCOUNT,
  ROUTES_CONTACT,
  ROUTES_FAQ,
  ROUTES_HOME,
  ROUTES_LOGIN,
  ROUTES_MANAGER,
  ROUTES_SEARCH,
} from '../../../constants/routes'
import {useAuth} from '../../../utils/AuthContext'

const Burger = () => {
  const {push} = useRouter()
  const {t} = useTranslation('navbar')

  const {user} = useAuth()

  const renderSignIn = () => (
    <>
      <MenuItem onClick={() => push(ROUTES_LOGIN)}>{t('common:sign_in')}</MenuItem>
    </>
  )

  const renderUser = () => (
    <>
      <MenuItem onClick={() => push(ROUTES_ACCOUNT)}>{user && user.firebase.displayName}</MenuItem>
      <MenuItem onClick={fetchLogout}>{t('common:sign_out')}</MenuItem>
    </>
  )

  return (
    <Menu>
      <MenuButton pt={2} px={0}>
        <Flex>
          <Image src='/icons/user_menu.svg' width={64} height={32} alt='user-menu' />
        </Flex>
      </MenuButton>
      <MenuList zIndex={9999}>
        {user ? renderUser() : renderSignIn()}
        {user && user.role === Role.ADMIN && (
          <MenuItem onClick={() => push(ROUTES_MANAGER)}>{t('common:manager')}</MenuItem>
        )}
        <MenuItem>
          <Divider />
        </MenuItem>
        <MenuItem onClick={() => push(ROUTES_HOME)}>{t('common:home')}</MenuItem>
        <MenuItem onClick={() => push(ROUTES_SEARCH())}>{t('common:search')}</MenuItem>
        <MenuItem onClick={() => push(ROUTES_CONTACT)}>{t('common:contact')}</MenuItem>
        <MenuItem>
          <Divider />
        </MenuItem>
        <MenuItem onClick={() => push(ROUTES_ABOUT)}>{t('common:about')}</MenuItem>
        <MenuItem onClick={() => push(ROUTES_FAQ)}>{t('common:faq')}</MenuItem>
      </MenuList>
    </Menu>
  )
}

export default Burger
