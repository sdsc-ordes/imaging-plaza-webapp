import {Flex, Menu, MenuButton, MenuItem, MenuList, Spinner, Box} from '@chakra-ui/react'
import useTranslation from 'next-translate/useTranslation'
import Image from 'next/image'
import {useRouter} from 'next/router'
import {ROUTES_ACCOUNT, ROUTES_LOGIN} from '../../../constants/routes'
import {useAuth} from '../../../utils/AuthContext'

const Account = () => {
  const router = useRouter()
  const {t} = useTranslation('navbar')

  const {isLoading, user, logout} = useAuth()

  if (isLoading) {
    //Render loading user
    return (
      <Menu variant='light' >
        <MenuButton>
          <Spinner />
        </MenuButton>
      </Menu>
    )
  } else if (user) {
    //Render Account menu
    return (
      
      <Menu variant='light'>
        <MenuButton>
          <Flex minW='10rem' justify='end'>
            <Image src='/icons/user_menu.svg' width={64} height={32} alt='user-menu' />
          </Flex>
        </MenuButton>
        <Box zIndex={110}>
        <MenuList>
          <MenuItem onClick={() => router.push(ROUTES_ACCOUNT)}>{t('common:profile')}</MenuItem>
          <MenuItem onClick={logout}>{t('common:sign_out')}</MenuItem>
        </MenuList>
        </Box>
      </Menu>
      
    )
  }

  //Render Login.
  return (
    
    <Menu variant='light'>
      <MenuButton>
        <Flex minW='10rem' justify='end'>
          <Image src='/icons/user_menu.svg' width={64} height={32} alt='user-menu' />
        </Flex>
      </MenuButton>
      <Box zIndex={110}>
      <MenuList>
        <MenuItem onClick={() => router.push(ROUTES_LOGIN)}>{t('common:sign_in')}</MenuItem>
      </MenuList>
      </Box>
    </Menu>
    
  )
}

export default Account
