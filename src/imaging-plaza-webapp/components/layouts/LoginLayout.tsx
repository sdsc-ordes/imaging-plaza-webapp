import {Flex} from '@chakra-ui/react'
import type {ReactNode} from 'react'
import Footer from './Footer'
import NavBar from './navbar/NavBar'

interface Props {
  children: ReactNode
}

const LoginLayout = ({children}: Props) => {
  return (
    <>
      <Flex flexDirection='column' minH='100vh'>
        <NavBar />
        <Flex
          position='relative'
          flex={1}
          bgImage={{base: '', md: "url('/login_dots.png')"}}
          bgSize='auto 70%'
          bgPos='bottom'
          bgRepeat='repeat-x'>
          {children}
        </Flex>
      </Flex>
      <Footer />
    </>
  )
}

export default LoginLayout
