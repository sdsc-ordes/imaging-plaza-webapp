import {createStandaloneToast} from '@chakra-ui/react'
import {isDev} from '../isDev'

const handleError = (
  e: any,
  description: string | null = null,
  callback: (() => void) | null = null
) => {
  const {toast} = createStandaloneToast()

  isDev && console.error(e)
  let message = description || 'Error'
  if (e && !description) {
    if (e.response) {
      message = e.response.message
    } else if (e.message) {
      message = e.message
    }
  }
  toast({
    title: 'Error',
    description: message,
    status: 'error',
    duration: 9000,
    isClosable: true,
  })
  if (callback) callback()
}

export default handleError
