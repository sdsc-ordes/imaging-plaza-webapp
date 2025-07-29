import {getObjectType, getTypeName, TypedZodShape} from '@/utils/schema-utils'
import {Box, Button, HStack, Spacer, Text, useDisclosure, useTheme, VStack} from '@chakra-ui/react'
import {omit} from '@coteries/utils'
import useTranslation from 'next-translate/useTranslation'
import {ReactNode, useState} from 'react'
import {FieldError} from 'react-hook-form'
import {z, ZodObject, ZodUnion} from 'zod'
import {SubFormModal as FormModal} from '../../Form/components/SubFormModal'
import Edit from '../../Icons/solid/Pen.svg'
import {useAutoformField} from '../AutoformFieldProvider'
import {FormControlWithError} from '../FormControlWithError'

/**
 * How to gather an union of objects (several inputs possible)
 * The fields informations are gathered through the AutoFormFieldProvider
 */
export const FormUnion = () => {
  const theme = useTheme()
  const {t} = useTranslation('schema')
  const {
    field,
    isOptional,
    path,
    textKey,
    setValue,
    watch,
    formState: {errors},
  } = useAutoformField()
  const unionField = field as ZodUnion<any>
  const fieldArray = unionField._def.options as ZodObject<TypedZodShape>[]
  const value = watch(path)
  const [currentFieldType, setCurrentFieldType] = useState<ZodObject<TypedZodShape>>()

  const {onOpen, isOpen, onClose} = useDisclosure()

  const save = (t: any) => {
    setValue(path, t)
    onClose()
  }

  const displayData = (id: string, data: any): ReactNode => {
    if (!data) return <Text>{t(`${getTypeName(id)}_label`)}: /</Text>
    if (Array.isArray(data)) {
      return <VStack align='start'> {data.map(x => displayData(id, x))}</VStack>
    } else if (data === Object(data)) {
      return (
        <VStack align='start'>
          <Text>{`${t(`type_label`)}: ${getTypeName(data['@type'])}`}</Text>
          {Object.entries(omit(data, '@type' as any)).map(x => displayData(x[0], x[1] as string))}
        </VStack>
      )
    } else {
      return <Text>{`${t(`${getTypeName(id)}_label`)}: ${data}`}</Text>
    }
  }

  return (
    <Box w='full'>
      <FormControlWithError
        error={errors[path] as FieldError}
        isRequired={!isOptional}
        label={t(`${textKey}_label`)}>
        <VStack
          backgroundColor={theme.colors.brand.white}
          p={4}
          borderRadius='big'
          w='full'
          align='start'>
          {value && displayData(path, value)}
          <HStack mt='3' align='end' w='full'>
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
                  leftIcon={
                    typ === value?.['@type'] ? (
                      <Edit color={theme.colors.brand.primary} height={14} width={14} />
                    ) : undefined
                  }>
                  {typ === value?.['@type'] ? 'Edit' : 'Set as ' + typ.split(':')[1]}
                </Button>
              )
            })}
          </HStack>
        </VStack>
      </FormControlWithError>

      <FormModal
        fieldType={currentFieldType ?? fieldArray[0]}
        field={
          currentFieldType === value?.['@type']
            ? (value as z.infer<ZodObject<TypedZodShape>>)
            : undefined
        }
        isVisible={isOpen}
        onClose={onClose}
        onSave={save}
      />
    </Box>
  )
}
