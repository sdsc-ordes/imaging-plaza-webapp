import {useTheme, VStack} from '@chakra-ui/react'
import type {ReactNode} from 'react'

interface Props {
  children: ReactNode
}

const LoginCard = ({children}: Props) => {
  const theme = useTheme()

  return (
    <VStack
      spacing='30px'
      px='40px'
      w='md'
      h='full'
      bgColor={theme.colors.brand.background}
      borderRadius='big'
      shadow='big'
      py='50px'
      mt={{base: '65px', lg: '87px'}}
      mb={{base: '101px', lg: '87px'}}
      mx={{base: '22px', sm: 'auto'}}>
      {children}
    </VStack>
  )
}

export default LoginCard
