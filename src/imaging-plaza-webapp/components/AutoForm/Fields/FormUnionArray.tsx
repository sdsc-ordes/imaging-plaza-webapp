import {Button, HStack, Spacer, useDisclosure, useTheme} from '@chakra-ui/react'
import {omit, unique} from '@coteries/utils'
import useTranslation from 'next-translate/useTranslation'
import {useMemo, useState} from 'react'
import {FieldError, useFieldArray} from 'react-hook-form'
import {ZodArray, ZodObject, ZodUnion, z} from 'zod'
import {TypedZodShape, getObjectType, getTypeName} from '../../../utils/schema-utils'
import {isZodUnion} from '../../../utils/zod-utils'
import FormTable from '../../Form/components/FormTable'
import {SubFormModal as FormModal} from '../../Form/components/SubFormModal'
import Plus from '../../Icons/solid/Plus.svg'
import {useAutoformField} from '../AutoformFieldProvider'
import {FormControlWithError} from '../FormControlWithError'
import React from 'react'
/**
 * How to gather an array of union of objects
 * The fields informations are gathered through the AutoFormFieldProvider
 */
export const FormUnionArray = () => {
  // console.log('FormUnionArray rendering'); // Log each render
  
  const {t} = useTranslation('schema')
  const {isOpen, onOpen, onClose} = useDisclosure()
  const {
    field,
    path,
    textKey,
    control,
    isOptional,
    watch,
    formState: {errors}
  } = useAutoformField()
  
  // Using watch directly instead of elements state
  const values = watch(path) ?? []
  // console.log('Current values:', values); // Log the current values

  const unionField = (field as ZodArray<any>)._def.type as ZodUnion<any>
  const fieldArray = unionField._def.options as ZodObject<TypedZodShape>[]
  const [currentFieldType, setCurrentFieldType] = useState<ZodObject<TypedZodShape>>()
  const theme = useTheme()

  const tableHeaders = useMemo<string[]>(() => {
    if (isZodUnion(unionField)) {
      return [
        '@type',
        ...unique(fieldArray.flatMap(o => Object.keys(omit(o._def.shape(), '@type')))),
      ]
    } else {
      return []
    }
  }, [unionField, fieldArray])

  const {fields, append, update, remove} = useFieldArray<z.infer<ZodObject<TypedZodShape>>>({
    control,
    name: path,
  })

  const [posis, setPosis] = useState<number | undefined>(undefined)

  const onEdit = (index: number) => {
    // console.log('Editing index:', index); // Log edit operations
    setPosis(index)
    setCurrentFieldType(
      fieldArray.find(
        f => f._def.shape()['@type'].parse(undefined) === (fields[index] as any)?.['@type']
      )
    )
    onOpen()
  }

  const onDelete = (index: number) => {
    // console.log('Deleting index:', index); // Log delete operations
    remove(index)
  }

  const save = (t: z.infer<ZodObject<TypedZodShape>>) => {
    // console.log('Saving new value:', t); // Log save operations
    if (posis === undefined) {
      append(t)
    } else {
      update(posis, t)
    }
    setCurrentFieldType(undefined)
    setPosis(undefined)
    onClose()
  }

  const currentField = useMemo(
    () => (typeof posis === 'undefined' ? undefined : fields[posis]),
    [posis, fields]
  )// const changeStateToProducer = () => {
  //   setElements(watch("schema:producer"));
    
  //   const prodFields = watch("schema:producer")

  //   const numberOfFields = fields.length;

  //   // This runs async
  //   prodFields.forEach((f: unknown) => append(f));

  //   // For some reason deleting this before appending was 
  //   // deleting all the items.
  //   for (let i = 0; i < numberOfFields; i++) {
  //     remove(i);
  //   }
  
  // };
  
  // Commented as it seems redundant. Deleted before PR in main. 
  // useEffect(() => {
  //   // if (elements.length === 0) {
  //   //   setElements(watch(path) ?? []);
  //   // }
  // }, [elements, path]);


  // Uncomment to check which fields are being 
  // copy to Maintainer
  // if (t(`${textKey}_label`) === "Maintainer") {
  //   console.log("Fields")
  //   console.log(fields)
  // }
  return (
    <>
      <FormControlWithError
        error={errors[path] as FieldError}
        isRequired={!isOptional}
        label={t(`${textKey}_label`)}>
        <FormTable
          titles={tableHeaders}
          titleKeys={tableHeaders}
          placeholder={t('form:placeholder_empty_table')}
          onEdit={onEdit}
          onDelete={onDelete}
          label={t(`${textKey}_label`)}
          elements={values}
        />
      </FormControlWithError>
      <HStack>
        <Spacer />
        {fieldArray.map((opt, i) => {
          const typ = getObjectType(opt)
          return (
            <Button
              key={i}
              onClick={() => {
                setCurrentFieldType(opt)
                onOpen()
              }}
              variant='outlined'
              type='button'
              leftIcon={<Plus color={theme.colors.brand.primary} height={14} width={14} />}>
              {'Add ' + getTypeName(typ)}
            </Button>
          )
        })}
      </HStack>
      <FormModal
        fieldType={currentFieldType ?? fieldArray[0]}
        field={currentField}
        isVisible={isOpen}
        onClose={() => {
          setCurrentFieldType(undefined)
          setPosis(undefined)
          onClose()
        }}
        onSave={save}
      />
    </>
  )
}
