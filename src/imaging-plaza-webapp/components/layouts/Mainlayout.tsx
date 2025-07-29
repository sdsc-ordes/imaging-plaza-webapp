import {Container, Flex, VStack} from '@chakra-ui/react'
import {useRouter} from 'next/router'
import {ReactNode} from 'react'
import {
  PROTECTED_ROUTE_MAPPING,
  ROUTES_ABOUT,
  ROUTES_CONTACT,
  ROUTES_FAQ,
  ROUTES_HOME,
} from '../../constants/routes'
import {Role} from '../../models/User'
import {useAuth} from '../../utils/AuthContext'
import Footer from './Footer'
import NavBar from './navbar/NavBar'

interface Props {
  restrictedType?: Role[]
  children: ReactNode
}

// Some pages have smaller container (to make text easier to read)
const SMALL_CONTAINER_PAGE = [ROUTES_ABOUT, ROUTES_FAQ, ROUTES_CONTACT]

const MainLayout = ({restrictedType, children}: Props) => {
  const router = useRouter()
  const {user, isLoading} = useAuth()

  if (restrictedType && !isLoading) {
    // @ts-ignore
    const authorizedRoles = PROTECTED_ROUTE_MAPPING[router.pathname] ?? ''
    if (!user || !authorizedRoles?.includes(user.role)) {
      router.push(ROUTES_HOME)
    }
  }

  return (
    <Flex flexDirection='column' minH='100vh'>
      <NavBar />
      <Flex position='relative' flex={1}>
        <VStack w='full' gridGap={32}>
            <Container
              p={0}
              maxW={SMALL_CONTAINER_PAGE.includes(router.asPath) ? 'container.lg' : 'container.xl'}
            >
              {children}
            </Container>
        </VStack>
      </Flex>
      <Footer />
    </Flex>
  )
}

export default MainLayout
