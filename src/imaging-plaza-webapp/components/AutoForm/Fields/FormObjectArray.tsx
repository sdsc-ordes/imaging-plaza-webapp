import {Button, useDisclosure, useTheme} from '@chakra-ui/react'
import {omit} from '@coteries/utils'
import useTranslation from 'next-translate/useTranslation'
import {useMemo, useState} from 'react'
import {FieldError, useFieldArray} from 'react-hook-form'
import {ZodArray, ZodObject, z} from 'zod'
import {TypedZodShape, getObjectType, getTypeName} from '../../../utils/schema-utils'
import {isZodObject} from '../../../utils/zod-utils'
import FormTable from '../../Form/components/FormTable'
import {SubFormModal as FormModal} from '../../Form/components/SubFormModal'
import Plus from '../../Icons/solid/Plus.svg'
import {useAutoformField} from '../AutoformFieldProvider'
import {FormControlWithError} from '../FormControlWithError'

/**
 * How to gather an array of objects
 * The fields informations are gathered through the AutoFormFieldProvider
 */
export const FormObjectArray = () => {
  const {t} = useTranslation('schema')
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
  const zObjectDef = (field as ZodArray<any>)._def.type as ZodObject<TypedZodShape>
  const theme = useTheme()

  const tableHeaders = useMemo<string[]>(() => {
    if (isZodObject(zObjectDef)) {
      return Object.keys(omit(zObjectDef.shape, '@type'))
    } else {
      return []
    }
  }, [zObjectDef])

  const {fields, append, update, remove} = useFieldArray<z.infer<ZodObject<TypedZodShape>>>({
    control,
    name: path,
  })

  const [posis, setPosis] = useState<number | undefined>(undefined)

  const onEdit = (index: number) => {
    setPosis(index)
    onOpen()
  }

  const type = useMemo(() => getObjectType((field as ZodArray<any>)._def.type), [field])

  const onDelete = (index: number) => {
    remove(index)
  }

  const save = (t: z.infer<ZodObject<TypedZodShape>>) => {
    // console.log('inserting')
    if (posis === undefined) {
      append(t)
    } else {
      update(posis, t)
    }
    setPosis(undefined)

    onClose()
  }
  const currentField = useMemo(
    () => (typeof posis === 'undefined' ? undefined : fields[posis]),
    [posis, fields]
  )

  // Technical debt: Exception to ensure compatibility with Funding Nested List
  // Very dirty, fix in the future.
  function flattenObject(obj: Record<string, any>): Record<string, any> {
    const result: Record<string, any> = {};
  
    for (const prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        if (typeof obj[prop] === 'object' && obj[prop] !== null) {
          const temp = flattenObject(obj[prop]);
          for (const tempProp in temp) {
            if (temp.hasOwnProperty(tempProp)) {
              // The parent category is chained but due to the parse based on : this makes
              // the locale unable to find the correct placeholder. This keeps the original
              // key in the nested list
              const key = prop === '@type' ? prop + '.' + tempProp : tempProp;
              result[key] = temp[tempProp];
            }
          }
        } else {
          result[prop] = obj[prop];
        }
      }
    }
  
    return result;
  }
  
  function flattenArray(arr: Record<string, any>[]): Record<string, any>[] {
    if (arr == null) {
      return [];
    }
  
    return arr.map(flattenObject);
  }

  // Technical debt: Exception to ensure compatibility of nested list in Impact
  let tableHeadersModified: string[] = [...tableHeaders];

  if (textKey === 'hasFunding') {
    tableHeadersModified = ['schema:identifier', 'sd:fundingGrant', 'md4i:hasRorId', 'schema:legalName'];
  } else {
    tableHeadersModified = tableHeaders; // set tableHeaders to its original value
  }

  return (
    <>
      <FormControlWithError
        error={errors[path] as FieldError}
        isRequired={!isOptional}
        label={t(`${textKey}_label`)}>
        <FormTable
          titles={tableHeadersModified}
          titleKeys={tableHeadersModified}
          placeholder={t('form:placeholder_empty_table')}
          onEdit={onEdit}
          onDelete={onDelete}
          label={t(`${textKey}_label`)}
          elements={textKey === 'hasFunding' ? flattenArray(watch(path)) : watch(path) ?? []}
          // elements={watch(path) ?? []}
        />
      </FormControlWithError>
      <Button
        variant='outlined'
        type='button'
        onClick={onOpen}
        leftIcon={<Plus color={theme.colors.brand.primary} height={14} width={14} />}>
        {t('add_modal_button', {type: getTypeName(type)})}
      </Button>

      <FormModal
        fieldType={zObjectDef}
        isVisible={isOpen}
        field={currentField as z.infer<typeof zObjectDef>}
        onSave={save}
        onClose={() => {
          onClose()
          setPosis(undefined)
        }}
      />
    </>
  )
}
