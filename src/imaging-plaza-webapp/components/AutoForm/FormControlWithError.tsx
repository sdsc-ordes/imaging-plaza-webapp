import {
  FormControl,
  FormControlProps,
  FormErrorMessage,
  FormErrorMessageProps,
  FormLabel,
  FormLabelProps,
  InputGroup,
} from '@chakra-ui/react'
import React, {PropsWithChildren, ReactNode} from 'react'
import {FieldErrors} from 'react-hook-form'

export type FormControlChakraStyle = {
  formControl?: FormControlProps
  formLabel?: FormLabelProps
  formErrorMessage?: FormErrorMessageProps
}

export const FormControlWithError: React.FC<
  PropsWithChildren<{
    label?: string
    leftElement?: ReactNode
    rightElement?: ReactNode
    error: FieldErrors<{[k: string]: string}>[string]
    below?: ReactNode
    chakraStyle?: FormControlChakraStyle
    isRequired?: boolean
  }>
> = ({label, error, children, leftElement, rightElement, below, chakraStyle, isRequired}) => {
  const controlProps = {...chakraStyle?.formControl}
  const labelProps = {...chakraStyle?.formLabel}
  const errorProps = {...chakraStyle?.formErrorMessage}
  return (
    <>
      <FormControl isInvalid={!!error} pb={below ? 3 : 0} isRequired={isRequired} {...controlProps}>
        {label && <FormLabel {...labelProps}>{label}</FormLabel>}
        <InputGroup>
          {leftElement}
          {children}
          {rightElement}
        </InputGroup>
        <FormErrorMessage {...errorProps}>{error?.message}</FormErrorMessage>
        {below}
      </FormControl>
    </>
  )
}

export const LabelInFront: FormControlChakraStyle = {
  formControl: {
    display: 'flex',
  },
  formLabel: {
    m: 0,
    mt: 2,
    mr: 2,
    flex: '1 0 fit-content',
  },
}
