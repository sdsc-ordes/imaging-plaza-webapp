import {Flex} from '@chakra-ui/react'
import Image from 'next/image'
import Link from 'next/link'
import {ROUTES_HOME} from '../../../constants/routes'
import {useIsDesktop} from '../../../hooks/useIsDesktop'
import Account from './Account'
import Burger from './Burger'
import Menu from './Menu'

// Navbar is different on mobile
const NavBar = () => {
  const isDesktop = useIsDesktop()

  return (
    <Flex h={isDesktop ? '5.5rem' : '4.25rem'} w='full' px={{base: 7, lg: 14}}>
      <Flex placeItems='center' justifyItems='center'>
        <Link href={ROUTES_HOME} passHref>
          <Image
            src='/logos/imaging_plaza.svg'
            width={206}
            height={33}
            alt='logo-header'
            style={{cursor: 'pointer'}}
          />
        </Link>
      </Flex>

      {isDesktop ? (
        <>
          <Menu />
          <Account />
        </>
      ) : (
        <Flex flexGrow={1} justify='end'>
          <Burger />
        </Flex>
      )}
    </Flex>
  )
}

export default NavBar
