import {FormControl, FormErrorMessage, Input, Text, useTheme, VStack} from '@chakra-ui/react'
import isNumber from 'lodash/isNumber'
import type {HTMLInputTypeAttribute} from 'react'
import {
  DeepMap,
  FieldError,
  FieldValues,
  Path,
  RegisterOptions,
  UseFormRegister,
} from 'react-hook-form'

interface Props<TFormValues extends FieldValues> {
  name: Path<TFormValues>
  label: string
  rules?: RegisterOptions
  register: UseFormRegister<TFormValues>
  errors: Partial<DeepMap<TFormValues, FieldError>>
  type?: HTMLInputTypeAttribute
  placeholder?: string
  fairLevel?: number
  watch?: string
}

const FormInput = <TFormValues extends FieldValues>({
  errors,
  name,
  label,
  register,
  rules,
  type = 'text',
  placeholder,
  fairLevel,
  watch,
}: Props<TFormValues>) => {
  const theme = useTheme()

  const error = errors ? errors[name] : undefined
  const max = isNumber(rules?.maxLength) ? rules?.maxLength : rules?.maxLength?.value

  return (
    <FormControl isInvalid={!!error} isRequired={rules && !!rules.required}>
      <VStack w='full' align='start' spacing={2}>
        <Input {...register(name, rules)} type={type} placeholder={placeholder} />
        {error && <FormErrorMessage>{error.message}</FormErrorMessage>}
        {watch && max && (
          <Text
            fontSize='small'
            w='full'
            align='end'
            textColor={watch.length > max ? theme.colors.brand.red : theme.colors.brand.grey}>
            {watch.length + '/' + max}
          </Text>
        )}
      </VStack>
    </FormControl>
  )
}

export default FormInput
