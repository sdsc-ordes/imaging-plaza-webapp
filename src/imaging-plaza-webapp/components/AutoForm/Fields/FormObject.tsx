import {getTypeName} from '@/utils/schema-utils'
import {Divider, Heading, VStack} from '@chakra-ui/react'
import useTranslation from 'next-translate/useTranslation'
import {ZodObject, ZodTypeAny} from 'zod'
import {isZodObject} from '../../../utils/zod-utils'
import AutoformFieldProvider, {useAutoformField} from '../AutoformFieldProvider'
import FormField from './FormField'

/**
 * How to gather a complex object
 * The fields informations are gathered through the AutoFormFieldProvider
 */
export const FormObject = ({placeholder}: {placeholder?: string}) => {
  const {t} = useTranslation('schema')
  const {field, path} = useAutoformField()
  const parts = path.split('.')

  return (
    <VStack align='stretch'>
      <Heading size='md' mb='2'>
        {t(getTypeName(parts[parts.length - 1]))}
      </Heading>
      {Object.entries((field as ZodObject<any>).omit({'@type': true}).shape).map(
        ([name, obj], index) => (
          <AutoformFieldProvider field={obj as ZodTypeAny} name={name} key={index}>
            {isZodObject(obj) && (
              <>
                <Divider my='3' />
              </>
            )}
            <FormField placeholder={placeholder} />
          </AutoformFieldProvider>
        )
      )}
    </VStack>
  )
}
