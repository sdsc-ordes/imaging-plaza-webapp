import {TypedZodShape, getTypeName} from '@/utils/schema-utils'
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Portal,
  useTheme,
} from '@chakra-ui/react'
import {zodResolver} from '@hookform/resolvers/zod'
import {useEffect} from 'react'
import {FormProvider, useForm} from 'react-hook-form'
import {ZodObject, z} from 'zod'
import AutoformFieldProvider from '../../AutoForm/AutoformFieldProvider'
import FormField from '../../AutoForm/Fields/FormField'
import FormModalFooter from './modals/FormModalFooter'

interface Props<S extends TypedZodShape, T extends ZodObject<S>> {
  onSave: (field: z.infer<T>) => void
  onClose: () => void
  isVisible: boolean
  fieldType: T
  field?: z.infer<T>
  placeholder?: string
}

export const SubFormModal = <S extends TypedZodShape, T extends ZodObject<S>>({
  field,
  fieldType,
  isVisible,
  onSave,
  onClose,
  placeholder,
}: Props<S, T>) => {
  const theme = useTheme()
  const formMethods = useForm<z.infer<T>>({resolver: zodResolver(fieldType)})
  const name = getTypeName(fieldType._def.shape()['@type'].parse(undefined))
  useEffect(() => {
    if (typeof field !== 'undefined') {
      formMethods.reset(field)
    }
  }, [field, formMethods])

  return (
    <Portal>
      <Modal
        isOpen={isVisible}
        onClose={onClose}
        size='2xl'
        closeOnEsc={false}
        closeOnOverlayClick={false}>
        <FormProvider {...formMethods}>
          <form
            onSubmit={e => {
              e.stopPropagation()
              formMethods.handleSubmit(onSave)(e)
            }}>
            <ModalOverlay />
            <ModalContent p={4} backgroundColor={theme.colors.brand.background} borderRadius='big'>
              <ModalHeader>{field ? `Edit ${name}` : `Add ${name}`}</ModalHeader>
              <ModalBody>
                <AutoformFieldProvider field={fieldType} reset>
                  <FormField placeholder={placeholder} />
                </AutoformFieldProvider>
                <FormModalFooter hideModal={onClose} />
              </ModalBody>
            </ModalContent>
          </form>
        </FormProvider>
      </Modal>
    </Portal>
  )
}
