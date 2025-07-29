import {FormControl, FormErrorMessage, FormLabel, VStack} from '@chakra-ui/react'
import type {ReactNode} from 'react'

interface Props {
  label?: string
  error: boolean
  errorMessage?: string
  children: ReactNode
}

const FormControlledInput = ({label, error, errorMessage, children}: Props) => {
  return (
    <FormControl isInvalid={error}>
      <VStack w='full' align='start' spacing={1}>
        {label && <FormLabel fontSize='regular'>{label}</FormLabel>}
        {children}
        <FormErrorMessage>{error && errorMessage}</FormErrorMessage>
      </VStack>
    </FormControl>
  )
}

export default FormControlledInput
