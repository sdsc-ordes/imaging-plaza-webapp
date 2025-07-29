/// <reference types="react" />
import {
  AlertStatus,
  As,
  BoxProps,
  ButtonProps,
  CreateStandAloneToastParam,
  FormControlProps,
  FormErrorMessageProps,
  FormLabelProps,
  InputProps,
  NumberInputFieldProps,
  SkeletonProps,
  SystemProps,
  TextProps,
  ToastId,
  UseToastOptions,
  createToastFn,
} from '@chakra-ui/react'
import {PrimitiveZodType, TypeHolder, addSuffixToObject} from '@coteries/utils'
import {IconName, IconProps, IconCollections, IconRegistry, CustomIcon as CustomIconType} from './icons'
import React, {ErrorInfo, PropsWithChildren, ReactNode} from 'react'
import {
  DefaultValues,
  FieldError,
  FieldErrors,
  FieldPath,
  FieldPathValue,
  FieldValues,
  RegisterOptions,
  UseFormRegisterReturn,
  UseFormSetError,
  UseFormWatch,
} from 'react-hook-form'
import {ZodObject, ZodRawShape, z} from 'zod'

declare const UnsafeIcon: ({i, col}: {i: IconName; col?: string | undefined}) => JSX.Element
declare const createIconContext: <
  C extends IconCollections,
  I extends IconRegistry
>(
  collections: C,
  icons: I,
  defaultCollection?: keyof C | undefined
) => [
  (p: PropsWithChildren) => JSX.Element,
  React.ComponentType<
    IconProps & {
      i: keyof I | IconName
    }
  >,
  TypeHolder<I>
]
type AvailableIcons<I extends IconRegistry> = keyof I
declare const CustomIcon: ({i}: {i: CustomIconType}) => JSX.Element

type EditableTextProps = {
  text: string | null
  onChange: (t: string) => void
  addAText: string
  type?: 'input' | 'textarea'
  as?: As
  plusIcon?: CustomIconType
  changeIcon?: CustomIconType
  editIcon?: CustomIconType
  isDisabled?: boolean
}
declare const EditableText: ({
  text,
  onChange,
  addAText,
  type,
  as,
  plusIcon,
  changeIcon,
  editIcon,
  isDisabled,
}: EditableTextProps) => JSX.Element

type FormControlChakraStyle = {
  formControl?: FormControlProps
  formLabel?: FormLabelProps
  formErrorMessage?: FormErrorMessageProps
}
declare const FormControlWithError: React.FC<
  PropsWithChildren<{
    label?: string
    leftElement?: ReactNode
    rightElement?: ReactNode
    error: FieldErrors<{
      [k: string]: string
    }>[string]
    below?: ReactNode
    chakraStyle?: FormControlChakraStyle
    isRequired?: boolean
  }>
>
declare const LabelInFront: FormControlChakraStyle

type Special =
  | 'string'
  | 'number'
  | {
      options: {
        value: string
        label: string
      }[]
    }
type BaseFormField<A extends FieldValues, K extends FieldPath<A>> = {
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
type FormFieldSelect<A extends FieldValues, K extends FieldPath<A>> = BaseFormField<A, K> & {
  options: {
    label: string
    value: FieldPathValue<A, K>
  }[]
  type: 'select'
}
type FormFieldInput<A extends FieldValues, K extends FieldPath<A>> = BaseFormField<A, K> & {
  type?: 'password' | 'email' | 'bigtext'
}
type FormField<A extends FieldValues, K extends FieldPath<A>> =
  | FormFieldSelect<A, K>
  | FormFieldInput<A, K>
type FormFields<A extends FieldValues> = Partial<{
  [k in FieldPath<A>]: FormField<A, k>
}>
type FormSection<A extends FieldValues, C extends Record<string, true> = {}> = {
  title?: string
  fields: (FieldPath<A> | keyof C)[]
}
type FormSections<A extends FieldValues, C extends Record<string, true> = {}> = Record<
  string,
  FormSection<A, C>
>
type FormDescriptor<A extends FieldValues, C extends Record<string, true> = {}> = Partial<{
  submitText: string
  submitProps: ButtonProps
  cancel: {
    text: string
    onCancel: () => void
  }
  sections: Record<string, FormSection<A, C>>
  fields: FormFields<A>
  labelForField: (field: string) => string
  placeholderForField: (field: string) => string
  custom: C
  hideRequiredSign: boolean
  spacing: SystemProps['margin']
}>

type FieldProps = {
  name: string
  ztype: PrimitiveZodType
  error: FieldError
  register: UseFormRegisterReturn
  descriptor?: FormField<any, any>
  label?: string
  placeholder?: string
  hideRequiredSign?: boolean
}
declare const zInput: ({
  ztype,
  ...props
}: {
  ztype: PrimitiveZodType
} & (InputProps | NumberInputFieldProps)) => JSX.Element
declare const leftAddOn: (icon?: ReactNode, addon?: ReactNode) => JSX.Element | null
declare const rightAddOn: (icon?: ReactNode, addon?: ReactNode) => JSX.Element | null
declare const TypedField: ({
  name,
  ztype,
  error,
  register,
  descriptor,
  label,
  placeholder,
  hideRequiredSign,
}: FieldProps) => JSX.Element

declare const CompSuffix: 'Comp'
type AutoFormRef<A extends FieldValues> = {
  setError: UseFormSetError<A>
  watch: UseFormWatch<A>
}
type AutoFormProps<
  A extends ZodObject<ZodRawShape>,
  C extends Record<string, true>,
  CC extends {
    [k in keyof addSuffixToObject<C, typeof CompSuffix>]: JSX.Element
  }
> = {
  model: A
  onSubmit: (data: z.infer<A>) => Promise<void>
  descriptor?: FormDescriptor<z.infer<A>, C>
  formRef?: React.ForwardedRef<AutoFormRef<z.infer<A>>>
  defaultValues?: DefaultValues<z.infer<A>>
  debug?: boolean
} & CC
declare const AutoForm: <
  A extends z.ZodObject<
    z.ZodRawShape,
    z.UnknownKeysParam,
    z.ZodTypeAny,
    {
      [x: string]: any
    },
    {
      [x: string]: any
    }
  >,
  C extends Record<string, true>,
  CC extends addSuffixToObject<C, 'Comp'> extends infer T ? {[k in keyof T]: JSX.Element} : never
>({
  model,
  defaultValues,
  onSubmit,
  descriptor,
  formRef,
  debug,
  ...props
}: AutoFormProps<A, C, CC>) => JSX.Element

type PictureGalleryProps = {
  pictures: string[]
  seePhotosText: string
}
declare const PictureGallery: ({pictures, seePhotosText}: PictureGalleryProps) => JSX.Element | null

interface SkelTextProps extends TextProps {
  skelProps?: Omit<SkeletonProps, 'isLoading'>
}
declare const SkelText: ({skelProps, children, ...textProps}: SkelTextProps) => JSX.Element

type TagExtractor<I> = (i: I) => {
  tagIcon: IconName
  label: string
}
type TimelineProps<I> = {
  items: I[]
  Component: ({item}: {item: I}) => JSX.Element
  tagExtractor: TagExtractor<I>
}
declare function Timeline<I>({items, Component, tagExtractor}: TimelineProps<I>): JSX.Element

type FileUploadProps = PropsWithChildren<{
  title: string
  subtitle: string
  onChange: (files: File[]) => void
  error?: string
}>
declare const FileUpload: ({
  title,
  subtitle,
  onChange: onUpload,
  children,
  error,
}: FileUploadProps) => JSX.Element

type ImageFile = {
  src: string
  fileRef: File
}
declare const ImageFileUpload: ({
  onChange,
  defaultFiles,
  error,
}: {
  onChange: (files: ImageFile[]) => void
  defaultFiles?: ImageFile[] | undefined
  error?: string | undefined
}) => JSX.Element

type VerticalDrawerProps = PropsWithChildren<
  {
    title: string
    expandedWidth: BoxProps['w']
    bg?: BoxProps['bg']
    icon?: CustomIconType
    defaultCollapsed?: boolean
  } & Omit<BoxProps, 'w' | 'width'>
>
declare const VerticalDrawer: ({
  title,
  children,
  expandedWidth,
  bg,
  icon,
  defaultCollapsed,
  ...props
}: VerticalDrawerProps) => JSX.Element

type Props = CreateStandAloneToastParam
declare const ToastContainer: React.FC<Props>
type ToastShortHandFn = (
  title: string,
  options?: Omit<UseToastOptions, 'status'> | undefined
) => ToastId
type ToastShortHands = {
  [k in AlertStatus]: ToastShortHandFn
}
declare const toast: ReturnType<typeof createToastFn> & ToastShortHands

type ErrorBoundaryProps = PropsWithChildren & {
  onError: (e: Error) => void
}
declare class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  {
    hasError: boolean
  }
> {
  constructor(props: ErrorBoundaryProps)
  static getDerivedStateFromError(_: Error): {
    hasError: boolean
  }
  handleUncaughtError(event: PromiseRejectionEvent): void
  componentDidMount(): void
  componentWillUnmount(): void
  componentDidCatch(error: Error, _: ErrorInfo): void
  render(): JSX.Element
}

type ErrorListenerProps = PropsWithChildren &
  OnErrorProps & {
    getToastFromError?: (e: Error) => UseToastOptions | undefined
  }
type OnErrorProps = {
  onError?: (e: Error) => void
}
/**
 * Listens on Errors which might happen
 * @returns
 */
declare const ErrorListener: ({
  children,
  getToastFromError: getToastFromError,
  onError,
}: ErrorListenerProps) => JSX.Element

export {
  AutoForm,
  AutoFormProps,
  AutoFormRef,
  AvailableIcons,
  BaseFormField,
  CustomIcon,
  EditableText,
  EditableTextProps,
  ErrorBoundary,
  ErrorListener,
  FieldProps,
  FileUpload,
  FormControlChakraStyle,
  FormControlWithError,
  FormDescriptor,
  FormField,
  FormFieldInput,
  FormFieldSelect,
  FormFields,
  FormSection,
  FormSections,
  ImageFile,
  ImageFileUpload,
  LabelInFront,
  PictureGallery,
  SkelText,
  Special,
  TagExtractor,
  Timeline,
  TimelineProps,
  ToastContainer,
  TypedField,
  UnsafeIcon,
  VerticalDrawer,
  VerticalDrawerProps,
  createIconContext,
  leftAddOn,
  rightAddOn,
  toast,
  zInput,
}

// Re-export icon types for convenience
export type {
  IconName,
  IconProps,
  IconCollections,
  IconRegistry,
  CustomIcon as CustomIconType,
} from './icons'
