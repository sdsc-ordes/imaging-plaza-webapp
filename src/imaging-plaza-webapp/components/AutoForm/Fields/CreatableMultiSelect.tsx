import {Box} from '@chakra-ui/react'
import {CreatableSelect} from 'chakra-react-select'
import useTranslation from 'next-translate/useTranslation'
import {Controller, FieldError} from 'react-hook-form'
import {ZodArray} from 'zod'
import {chakraStyles} from '../../../styles/selectStyles'
import {useAutoformField} from '../AutoformFieldProvider'
import {FormControlWithError} from '../FormControlWithError'
import {FormField} from '../types'

export type Props = {
  fieldProps?: FormField<any, any>
}

/**
 * How to gather an array of primitives from an open list
 * Compatible with a predefined list too but there should be a type union
 * The fields informations are gathered through the AutoFormFieldProvider
 */
const CreatableMultiSelect = ({fieldProps}: Props) => {
  const {t} = useTranslation('schema')
  const {field, isOptional, path, textKey, control} = useAutoformField()
  const genField = (field as ZodArray<any>)._def.type

  return (
    <Controller
      control={control}
      name={path}
      render={({field: {onChange, value, onBlur, name, ref}, fieldState: {error}}) => {
        return (
          <FormControlWithError
            chakraStyle={fieldProps?.chakraStyle}
            error={error as FieldError}
            isRequired={!isOptional}
            label={t(`${textKey}_label`)}>
            <Box w='full'>
            <CreatableSelect
                focusBorderColor='brand.primary'
                placeholder='Select multiple...'
                chakraStyles={chakraStyles}
                isMulti
                onChange={v => {
                  onChange(v.map(o => o.value))
                }}
                value={
                  (value as string[])?.map(v => ({
                    value: v,
                    label: t(v),
                  })) as any
                }
                onBlur={onBlur}
                name={name}
                ref={ref}
                options={Object.values(genField._def.options[0]._def.values as Object).map(option => ({
                  value: option,
                  label: t(option),
                }))}
              />
            </Box>
          </FormControlWithError>
        )
      }}></Controller>
  )
}

export default CreatableMultiSelect
