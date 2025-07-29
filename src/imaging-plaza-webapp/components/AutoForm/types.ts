import {
  ButtonProps,
  FormControlProps,
  FormErrorMessageProps,
  FormLabelProps,
} from '@chakra-ui/react'
import {ReactNode} from 'react'
import {FieldPath, FieldPathValue, FieldValues, RegisterOptions} from 'react-hook-form'

export type Special =
  | 'string'
  | 'number'
  | {
      options: {value: string; label: string}[]
    }

export type BaseFormField<A extends FieldValues, K extends FieldPath<A>> = {
  registerOptions?: RegisterOptions<A, K>
  leftAddon?: ReactNode
  rightAddon?: ReactNode
  rightIcon?: ReactNode
  leftIcon?: ReactNode
  chakraStyle?: {
    formControl?: FormControlProps
    formLabel?: FormLabelProps
    formErrorMessage?: FormErrorMessageProps
  }
}

export type FormFieldSelect<A extends FieldValues, K extends FieldPath<A>> = BaseFormField<A, K> & {
  options: {label: string; value: FieldPathValue<A, K>}[]
  type: 'select'
}

export type FormFieldInput<A extends FieldValues, K extends FieldPath<A>> = BaseFormField<A, K> & {
  type?: 'password' | 'email'
}

export type FormField<A extends FieldValues, K extends FieldPath<A>> =
  | FormFieldSelect<A, K>
  | FormFieldInput<A, K>

export type FormFields<A extends FieldValues> = Partial<{
  [k in FieldPath<A>]: FormField<A, k>
}>

export type FormSection<A extends FieldValues, C extends Record<string, true> = {}> = {
  title?: string
  description?: string
  fields: (FieldPath<A> | keyof C)[]
}

export type FormDescriptor<A extends FieldValues, C extends Record<string, true> = {}> = Partial<{
  submitText: string
  submitProps: ButtonProps
  cancel: {
    text: string
    onCancel: () => void
  }
  sections: Record<string, FormSection<A, C>> | FormSection<A, C>
  fields: FormFields<A>
}>

export type FormSchema<A extends FieldValues, C extends Record<string, true> = {}> = {
  descriptors: Record<string, FormDescriptor<A, C>>
  labelForField?: (field: string) => string
  placeholderForField?: (field: string) => string
}
