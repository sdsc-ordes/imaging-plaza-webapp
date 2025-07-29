import {Button, useDisclosure, useTheme} from '@chakra-ui/react'
import useTranslation from 'next-translate/useTranslation'
import {useMemo, useState} from 'react'
import {FieldError, useFieldArray} from 'react-hook-form'
import {ZodArray, ZodObject, ZodType, ZodTypeAny, z} from 'zod'
import FormTable from '../../Form/components/FormTable'
import {SubFormModal as FormModal} from '../../Form/components/SubFormModal'

import {TypedZodShape} from '../../../utils/schema-utils'
import Plus from '../../Icons/solid/Plus.svg'
import {useAutoformField} from '../AutoformFieldProvider'
import {FormControlWithError} from '../FormControlWithError'

const ValueWrapper = <T extends ZodType>(
  field: T
): ZodObject<TypedZodShape & {value: z.infer<T>}> =>
  z.object({
    '@type': z.string().default('value'),
    value: field,
  })

/**
 * How to gather an array of primitives
 * The fields informations are gathered through the AutoFormFieldProvider
 */
export const FormPrimitiveArray = () => {
  const {t} = useTranslation('schema')
  const theme = useTheme()
  const {isOpen, onOpen, onClose} = useDisclosure()
  const {
    field,
    path,
    textKey,
    control,
    isOptional,
    watch,
    formState: {errors},
  } = useAutoformField()
  const zPrimitiveDef = (field as ZodArray<any>)._def.type as ZodTypeAny

  const {append, update, remove} = useFieldArray<z.infer<typeof zPrimitiveDef>>({
    control,
    name: path,
  })

  const [posis, setPosis] = useState<number | undefined>(undefined)

  const currentField = useMemo(() => {
    const field = typeof posis === 'undefined' ? '' : watch(path)?.[posis]
    return field
  }, [posis, path, watch])

  const onEdit = (index: number) => {
    setPosis(index)

    onOpen()
  }

  const onDelete = (index: number) => {
    remove(index)
  }

  const fieldType = ValueWrapper(zPrimitiveDef)

  const save = (wrapper: z.infer<typeof fieldType>) => {
    // console.log('inserting')
    if (posis === undefined) {
      append(wrapper.value!)
    } else {
      update(posis, wrapper.value!)
    }

    onClose()
  }

  return (
    <>
      <FormControlWithError
        error={errors[path] as FieldError}
        isRequired={!isOptional}
        label={t(`${textKey}_label`)}>
        <FormTable<typeof zPrimitiveDef>
          titles={['value']}
          titleKeys={['value']}
          placeholder={t('form:placeholder_empty_table')}
          onEdit={onEdit}
          onDelete={onDelete}
          label={t(`${textKey}_label`)}
          elements={Array.isArray(watch(path)) ? watch(path).map((t: any) => ({ value: t })) : []}
        />
      </FormControlWithError>
      <Button
        variant='outlined'
        type='button'
        onClick={() => {
          setPosis(undefined)
          onOpen()
        }}
        leftIcon={<Plus color={theme.colors.brand.primary} height={14} width={14} />}>
        {t('add_modal_button', {type: 'value'})}
      </Button>

      <FormModal
        fieldType={fieldType}
        placeholder={t(`${textKey}_placeholder`)}
        field={typeof currentField !== 'undefined' ? {value: currentField, '@type': 'value'} : {}}
        isVisible={isOpen}
        onClose={() => {
          onClose()
          setPosis(undefined)
        }}
        onSave={save}
      />
    </>
  )
}

export default FormPrimitiveArray
