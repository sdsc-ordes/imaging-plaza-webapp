import {createStandaloneToast} from '@chakra-ui/react'
import customTheme from '../styles/index'

export const showToast = (title: string, variant: 'success' | 'error') => {
  const {toast} = createStandaloneToast({theme: customTheme})

  toast({
    title,
    variant,
    duration: 6000,
    position: 'top',
    isClosable: false,
    containerStyle: {
      color: '#fff',
      backgroundColor: 'black',
    },
  })
}
