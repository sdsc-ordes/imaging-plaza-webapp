import {Box, FormControl, FormErrorMessage, VStack} from '@chakra-ui/react'
import {Select} from 'chakra-react-select'
import useTranslation from 'next-translate/useTranslation'
import {DeepMap, FieldError, FieldValues, Path, RegisterOptions} from 'react-hook-form'
import {SoftwareProperty, SoftwareTask} from '../../../models/SoftwareProperties'
import {chakraStyles} from '../../../styles/selectStyles'
import {convertSPToMultipleSelectObject} from '../../../utils/software/formHelper'

export type multipleSelectType = {value: string; label: string}

interface Props<TFormValues extends FieldValues> {
  name: Path<TFormValues>
  label: string
  rules?: RegisterOptions
  errors: Partial<DeepMap<TFormValues, FieldError>>
  placeholder?: string
  options: Array<SoftwareProperty | SoftwareTask>
  fairLevel?: number
  values: multipleSelectType[]
  setValues: (val: multipleSelectType[]) => void
}

const FormPropertyMultipleSelect = <TFormValues extends FieldValues>({
  name,
  label,
  rules,
  errors,
  placeholder,
  options,
  fairLevel,
  setValues,
  values,
}: Props<TFormValues>) => {
  const {t} = useTranslation()

  const error = errors ? errors[name] : undefined

  const formattedOptions = convertSPToMultipleSelectObject(options, t).sort((a, b) =>
    a.label.localeCompare(b.label)
  )

  return (
    <FormControl isInvalid={!!error} isRequired={rules && !!rules.required}>
      <VStack w='full' align='start' spacing={2}>
        <Box w='full'>
          <Select
            minMenuHeight={200}
            focusBorderColor='brand.primary'
            chakraStyles={chakraStyles}
            isMulti
            options={formattedOptions}
            //@ts-ignore - this is nasty but type are strange. Wasn't able to make them work properly
            onChange={setValues}
            placeholder={placeholder}
            closeMenuOnSelect={false}
            selectedOptionStyle='check'
            hideSelectedOptions={false}
            value={values}
          />
        </Box>
      </VStack>
      <FormErrorMessage>{error && error.message}</FormErrorMessage>
    </FormControl>
  )
}

export default FormPropertyMultipleSelect
