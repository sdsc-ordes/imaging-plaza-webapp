import {
  FormControl,
  FormErrorMessage,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
} from '@chakra-ui/react'
import {HTMLInputTypeAttribute, useState} from 'react'
import {
  DeepMap,
  FieldError,
  FieldValues,
  Path,
  RegisterOptions,
  UseFormRegister,
} from 'react-hook-form'
import Eye from '../../Icons/regular/Eye.svg'
import EyeSlash from '../../Icons/regular/EyeSlash.svg'

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

const FormInputPassword = <TFormValues extends FieldValues>({
  errors,
  name,
  label,
  register,
  rules,
  placeholder,
  fairLevel,
}: Props<TFormValues>) => {
  const error = errors ? errors[name] : undefined

  const [showPassword, setShowPassword] = useState<boolean>(false)

  return (
    <FormControl isInvalid={!!error} isRequired={rules && !!rules.required}>
      <VStack w='full' align='start' spacing={2}>
        <InputGroup>
          <Input
            {...register(name, rules)}
            type={showPassword ? 'text' : 'password'}
            placeholder={placeholder}
          />
          <InputRightElement>
            {showPassword ? (
              <Eye height={16} width={16} onClick={() => setShowPassword(!showPassword)} />
            ) : (
              <EyeSlash height={16} width={16} onClick={() => setShowPassword(!showPassword)} />
            )}
          </InputRightElement>
        </InputGroup>
        {error && <FormErrorMessage>{error.message}</FormErrorMessage>}
      </VStack>
    </FormControl>
  )
}

export default FormInputPassword
