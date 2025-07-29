import {VStack} from '@chakra-ui/react'
import {toast} from '@coteries/react/ui'
import {useEffect, useState} from 'react'
import useTranslation from 'next-translate/useTranslation'
import {z, ZodObject, ZodRawShape} from 'zod'
import {useFormStore} from '../../stores/formStore'
import {AutoForm, FormSchema} from '../AutoForm'

interface Props<A extends ZodObject<ZodRawShape>, C extends Record<string, true>> {
  fields: A
  schema: FormSchema<z.infer<A>, C>
  currentDescriptor: string
  onSave?: (isSaved: boolean) => void
  onDirty?: (isSaved: boolean) => void
}

/**
 * entry point for the schema form.
 *
 */
const SchemaForm = <A extends ZodObject<ZodRawShape>, C extends Record<string, true>>({
  fields,
  schema,
  currentDescriptor,
  onSave,
  onDirty
}: Props<A, C>) => {
  const {data, saveDraft, setDirty, isDirty, isDraftDisabled} = useFormStore()
  const {t} = useTranslation('schema')

  // Checking if the user has perform any changes after saving 
  const [isSaved, setIsSaved] = useState(false);
  useEffect(() => {
    if (isSaved && isDirty) {
      onSave?.(false);
    }
  }, [isSaved, isDirty, onSave]);

  useEffect(() => {
    onDirty?.(isDirty);
  }, [isDirty, onDirty]);

  return (
    <>
      <VStack
        spacing={8}
        flexGrow='1'
        display='flex'
        bg='brand.background'
        borderRadius='big'
        w='full'
        p={8}>
        <AutoForm
          value={data}
          fields={fields}
          descriptor={schema.descriptors[currentDescriptor]}
          onSubmit={async o => {
            await saveDraft(o)
            toast.success(t('draft-saved'))
            onSave?.(true)
            setIsSaved?.(true)
          }}
          onDirty={setDirty}
          isSubmitDisabled={isDraftDisabled}
        />
      </VStack>
    </>
  )
}

export default SchemaForm
