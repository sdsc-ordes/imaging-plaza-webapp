import {Box, Button, HStack, VStack} from '@chakra-ui/react'
import {toast} from '@coteries/react/ui'
import {zodResolver} from '@hookform/resolvers/zod'
import useTranslation from 'next-translate/useTranslation'
import {useEffect, useState} from 'react'
import {FieldValues, FormProvider, UseFormSetError, UseFormWatch, useForm} from 'react-hook-form'
import {ZodObject, ZodRawShape, z} from 'zod'
import FormField from '../AutoForm/Fields/FormField'
import FormTitle from '../Form/components/FormTitle'
import AutoformFieldProvider from './AutoformFieldProvider'
import {FormSection} from './types'
import {
  useDisclosure,
} from '@chakra-ui/react'

export type AutoFormSectionRef<B extends FieldValues> = {
  setError: UseFormSetError<B>
  watch: UseFormWatch<B>
}

export type Props<A extends ZodObject<ZodRawShape>, C extends Record<string, true>> = {
  fields: A
  value?: Partial<z.infer<A>>
  section: FormSection<z.infer<A>, C>
  first?: boolean
  onSubmit: (object: z.infer<A>) => Promise<void>
  onDirty?: () => void
  isSubmitDisabled?: boolean
  //isDirty: boolean
}

/**
 * One section of the form (overview for instance)
 * list the field and create a form based on the filtered schema fields
 * save draft is here
 */
export const AutoFormSection = <A extends ZodObject<ZodRawShape>, C extends Record<string, true>>({
  fields,
  section,
  first = false,
  value,
  onSubmit,
  onDirty,
  isSubmitDisabled,
}: Props<A, C>) => {
  const pickedFields = fields.pick(
    section.fields.reduce(
      (acc, f) => ({...acc, [f]: true}),
      {} as Record<keyof typeof fields, true>
    )
  )
  const {t} = useTranslation('schema')

  const formMethods = useForm<z.infer<A>>({resolver: zodResolver(pickedFields)})

  const {
    handleSubmit,
    trigger,
    formState: {errors, isDirty},
    reset,
  } = formMethods

  useEffect(() => {
    if (value) {
      reset(value)
    }
  }, [value, reset])

  useEffect(() => {
    if (isDirty) {
      onDirty?.()
    }
  }, [isDirty, onDirty])

  const [submitting, setSubmitting] = useState(false)
  useEffect(() => {
    if (Object.keys(errors).length > 0) toast.error('errors: ' + Object.keys(errors).join(', '))
  }, [errors])

  const submitWrapper = async (d: z.infer<A>) => {
    setSubmitting(true)
    try {
      // Based on copilot this will trim the input values before sending to the DB
      for (let key in d) {
        if (typeof d[key] === 'string') {
          d[key] = d[key].trim();
        }
      }
      await onSubmit(d)
    } catch (e) {
      console.error('error while submitting: ', e)
    } finally {
      setSubmitting(false)
    }
  }

  const {onOpen} = useDisclosure()

  // // To obtain was being retrieved.
  //   console.log(value)


  return (
    <FormProvider {...formMethods}>
      <Box w={['full']}>
        <form
          onSubmit={e => {
            trigger()
            handleSubmit(submitWrapper)(e)
          }}>
          <VStack w='full' align='stretch'>
            <VStack w='full' align='stretch'>
              <HStack>
                {section.title && (
                  <FormTitle title={section.title} description={section.description} first={first}>
                    <Button
                      isDisabled={isSubmitDisabled}
                      type='submit'
                      colorScheme='teal'
                      bg='brand.primary'
                      isLoading={submitting}
                      onClick={onOpen}>
                      {t('save-draft')}
                    </Button>
                  </FormTitle>
                )}
              </HStack>
              {section.fields.map(name => (
                <AutoformFieldProvider
                  field={fields.shape[name as string]}
                  name={name as string}
                  key={name as string}>
                  <FormField />
                </AutoformFieldProvider>
              ))}
              <HStack>
                {section.title && (
                  <FormTitle title='' description='' first={false}>
                    <Button
                      isDisabled={isSubmitDisabled}
                      type='submit'
                      colorScheme='teal'
                      bg='brand.primary'
                      isLoading={submitting}
                      onClick={onOpen}>
                      {t('save-draft')}
                    </Button>
                  </FormTitle>
                )}
              </HStack>
            </VStack>
          </VStack>
        </form>
      </Box>

      {/* <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Modal Title</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <p>Modal content goes here</p>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Close
            </Button>
            <Button variant='ghost'>Secondary Action</Button>
          </ModalFooter>
        </ModalContent>
      </Modal> */}
    </FormProvider>
  )
}