import {
  Input,
  InputLeftAddon,
  InputLeftElement,
  InputProps,
  InputRightAddon,
  InputRightElement,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputFieldProps,
  NumberInputStepper,
  Select,
  SelectProps,
  Switch,
} from '@chakra-ui/react'
import {isZodBoolean, isZodDate, isZodNumber, validate} from '@coteries/utils'
import useTranslation from 'next-translate/useTranslation'
import {ReactNode, useMemo} from 'react'
import {FieldError} from 'react-hook-form'
import {ZodNativeEnumDef, ZodTypeAny} from 'zod'
import {useAutoformField} from '../AutoformFieldProvider'
import {FormControlWithError} from '../FormControlWithError'
import {FormField} from '../types'

const isZodEnum = validate<ZodNativeEnumDef>(
  o => typeof o === 'object' && o._def?.typeName === 'ZodNativeEnum'
)

/**
 * How to gather a primitive
 * The fields informations are gathered through the AutoFormFieldProvider
 */
const FieldSwitch = ({...props}: InputProps | NumberInputFieldProps | SelectProps) => {
  const {t} = useTranslation('schema')
  const {field, path, textKey, register, watch} = useAutoformField()

  const genField = field as ZodTypeAny
  const rawValue = watch(path)

  const value = useMemo(() => {
    if (isZodDate(genField)) {
      const date = rawValue instanceof Date ? rawValue : new Date(rawValue)
      // Here is where the date is formated to ISO
      // console.log("DATE")
      // console.log(date)
      if (date.getTime() !== date.getTime()) {
        // invalide date
        return ''
      } else return date.toISOString().substring(0, 10)
    }
    return rawValue
  }, [rawValue, genField])

  if (isZodNumber(genField)) {
    return (
      <NumberInput w='100%' bg='white'>
        <NumberInputField
          {...(props as NumberInputFieldProps)}
          {...register(path, {valueAsNumber: true, required: !field.isOptional()})}
          placeholder={props.placeholder ?? t(`${textKey}_placeholder`)}
        />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </NumberInput>
    )
  } else if (isZodBoolean(genField as any)) {
    return <Switch {...register(path, {required: !field.isOptional()})} />
  } else if (isZodDate(genField as any)) {
    //register value as date
    return (
      <Input
        {...(props as InputProps)}
        {...register(path, {
          valueAsDate: true,
          required: !field.isOptional(),
          value,
        })}
        type='date'
      />
    )
  } else if (isZodEnum(genField as any)) {
    return (
      <Select {...(props as SelectProps)} {...register(path)} placeholder='Select one...'>
        {Object.values(genField._def.values as Object).map(option => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </Select>
    )
  }

  return (
    <Input
      {...(props as InputProps)}
      placeholder={props.placeholder ?? t(`${textKey}_placeholder`)}
      {...register(path, {
        required: !field.isOptional(),
        setValueAs: v => (v === '' ? undefined : v),
      })}
    />
  )
}

export const leftAddOn = (icon?: ReactNode, addon?: ReactNode) => {
  if (icon) return <InputLeftElement>{icon}</InputLeftElement>
  if (addon) return <InputLeftAddon>{addon}</InputLeftAddon>

  return null
}

export const rightAddOn = (icon?: ReactNode, addon?: ReactNode) => {
  if (icon) return <InputRightElement>{icon}</InputRightElement>
  if (addon) return <InputRightAddon>{addon}</InputRightAddon>

  return null
}

export type Props = {
  fieldProps?: FormField<any, any>
  placeholder?: string
}

const PrimitiveField = ({fieldProps, placeholder}: Props) => {
  const {t} = useTranslation('schema')
  const {
    isOptional,
    formState: {errors},
    path,
    textKey,
  } = useAutoformField()

  return (
    <FormControlWithError
      chakraStyle={fieldProps?.chakraStyle}
      error={errors[path] as FieldError}
      isRequired={!isOptional}
      label={t(`${textKey}_label`)}
      leftElement={leftAddOn(fieldProps?.leftIcon, fieldProps?.leftAddon)}
      rightElement={rightAddOn(fieldProps?.rightIcon, fieldProps?.rightAddon)}>
      <FieldSwitch placeholder={placeholder} />
    </FormControlWithError>
  )
}

export default PrimitiveField
